// src/mqtt/mqttClient.js
import mqtt from "mqtt";
import { useMoodStore } from "../store/useMoodStore";

const DEFAULT_URL = import.meta.env.VITE_MQTT_URL || "wss://v9f9b1c9.ala.us-east-1.emqxsl.com:8084/mqtt";
const TOPICS = {
  telemetry: "butterboi/telemetry/#",
  cmd: "butterboi/cmd",
  mood: "robot/butterboi-01/ui/mood",
};

let client;

export function getClient() {
  if (client) return client;

  client = mqtt.connect(DEFAULT_URL, {
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
    clientId: `bb-web-${Math.random().toString(16).slice(2)}`,
    reconnectPeriod: 1500,
    clean: true,
  });

  client.on("connect", () => {
    console.log("[MQTT] conectado ✅");
    client.subscribe(TOPICS.mood, { qos: 0 });
  });

  client.on("message", (topic, message) => {
    if (topic === TOPICS.mood) {
      try {
        const data = JSON.parse(message.toString());
        if (data.mood) {
          useMoodStore.getState().setMood(data.mood);
          console.log("[MQTT] mood actualizado:", data.mood);
        }
      } catch {
        const txt = message.toString().trim();
        useMoodStore.getState().setMood(txt);
        console.log("[MQTT] mood plano:", txt);
      }
    }
  });

  client.on("error", (err) => console.error("[MQTT] error:", err));
  client.on("close", () => console.warn("[MQTT] desconectado ❌"));

  return client;
}

export function publishCmd(cmd, payload = {}) {
  const c = getClient();
  const msg = JSON.stringify({ command_key: cmd, payload, ts: Date.now() });
  c.publish(TOPICS.cmd, msg, { qos: 0, retain: false });
}

export const topics = TOPICS;
