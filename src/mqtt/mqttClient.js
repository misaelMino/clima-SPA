// mqttClient.js
import mqtt from "mqtt";
import { useMoodStore } from "../store/useMoodStore";

const DEFAULT_URL =
  import.meta.env.VITE_MQTT_URL ||
  "wss://v9f9b1c9.ala.us-east-1.emqxsl.com:8084/mqtt";

export const topics = {
  telemetry: "butterboi/telemetry/#",
  mood: "robot/butterboi-01/ui/mood",
  cmdLegacy: "butterboi/cmd",
  cmdDirectA: "robot/comandos",
  cmdDirectB: "sensory/robot/comandos",
  statusA: "robot/estado",
  statusB: "sensory/robot/status",
};

// ---------- HMR-safe singleton ----------
const G = globalThis;
G.__BB_MQTT__ ||= { client: null, queue: [], ready: false };

function flushQueue() {
  const c = G.__BB_MQTT__.client;
  if (!c || !c.connected) return;
  const q = G.__BB_MQTT__.queue;
  while (q.length) {
    const { topic, msg, opts } = q.shift();
    try {
      c.publish(topic, msg, opts);
    } catch {}
  }
}

function safePublish(topic, msg, opts = { qos: 0, retain: false }) {
  const c = getClient();
  // Evitá publish si está desconectando / no conectado
  if (!c || c.disconnecting || c.disconnected || !c.connected) {
    G.__BB_MQTT__.queue.push({ topic, msg, opts });
    console.warn("[MQTT] no conectado; encolado →", topic, msg);
    return false;
  }
  c.publish(topic, msg, opts);
  return true;
}

export function getClient() {
  if (G.__BB_MQTT__.client) return G.__BB_MQTT__.client;

  const client = mqtt.connect(DEFAULT_URL, {
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
    clientId: `bb-web-${Math.random().toString(16).slice(2)}`,
    reconnectPeriod: 1500,
    clean: true,
  });

  client.on("connect", () => {
    G.__BB_MQTT__.ready = true;
    console.log("[MQTT] conectado ✅");
    client.subscribe([topics.mood, topics.statusA, topics.statusB], { qos: 0 });
    flushQueue();
  });

  client.on("reconnect", () => console.log("[MQTT] reconectando…"));
  client.on("close", () => console.warn("[MQTT] desconectado ❌"));
  client.on("error", (err) => {
    // Silenciar el spam típico de publish en desconexión
    if (String(err?.message || "").includes("disconnect")) return;
    console.error("[MQTT] error:", err);
  });

  client.on("message", (topic, message) => {
    const txt = message.toString().trim();
    if (topic === topics.mood) {
      try {
        const data = JSON.parse(txt);
        useMoodStore.getState().setMood(data.mood ?? txt);
      } catch {
        useMoodStore.getState().setMood(txt);
      }
      return;
    }
    if (topic === topics.statusA || topic === topics.statusB) {
      console.log("[MQTT] status robot:", txt);
      return;
    }
  });

  G.__BB_MQTT__.client = client;
  return client;
}

// ---------- Publicadores ----------
function sendToRobotTopics(raw) {
  safePublish(topics.cmdDirectA, raw);
  safePublish(topics.cmdDirectB, raw);
}

export function publishCmdPlain(cmd) {
  sendToRobotTopics(cmd); // texto plano para el ESP32
}

export function publishCmdJson(cmd, payload = {}) {
  const msg = JSON.stringify({ accion: cmd, payload, ts: Date.now() });
  sendToRobotTopics(msg);
}

// Mantengo tu API legacy y además mando plano al robot
export function publishCmd(cmd, payload = {}) {
  publishCmdPlain(mapToRobot[cmd] ?? cmd);
  const legacy = JSON.stringify({ command_key: cmd, payload, ts: Date.now() });
  safePublish(topics.cmdLegacy, legacy);
}

// Mapa UI → comando plano del robot (por si llamás publishCmd con "up")
const mapToRobot = {
  up: "avanzar",
  down: "retroceder",
  left: "izquierda",
  right: "derecha",
  stop: "parar",
  dance: "bailar",
  spin: "girar360",
};
