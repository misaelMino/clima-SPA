// ... imports de siempre
import { create } from "zustand";
import { publishCmd, getClient } from "../mqtt/mqttClient";
import { useMoodStore } from "../store/useMoodStore";

const ROBOT_CMD_TOPICS = ["robot/comandos", "sensory/robot/comandos"];

const mapToRobot = {
  up: "avanzar",
  down: "retroceder",
  left: "izquierda",
  right: "derecha",
  stop: "parar",
  dance: "bailar",
  spin: "girar360",
};

function sendRobotPlain(cmd) {
  try {
    const c = getClient();
    if (!c) return;
    ROBOT_CMD_TOPICS.forEach((t) => c.publish(t, cmd, { qos: 0, retain: false }));
    console.log("[MQTT] →", ROBOT_CMD_TOPICS.join(","), ":", cmd);
  } catch (e) {
    console.warn("[MQTT] no se pudo publicar:", e?.message);
  }
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// plan troll igual que antes (invierte/duplica/aleatorio)
function trollPlan(kind) {
  if (kind === "stop") return ["stop"];
  const invert = { up: "down", down: "up", left: "right", right: "left" };
  const pool = ["up", "down", "left", "right", "dance", "spin"];
  const r = Math.random();
  if (r < 0.34) return [invert[kind] || kind];
  if (r < 0.67) return [kind, kind];
  return [pool[Math.floor(Math.random() * pool.length)]];
}

export const useRobotStore = create((set, get) => ({
  // ===== prefs
  movementDuration: 2,
  danceDuration: 10,
  randomIdle: true, // el “autónomo” del firmware puede engancharse con esto si querés
  idleMin: 6,
  idleMax: 14,

  // ===== telemetría
  battery: null,
  temperature: null,
  humidity: null,
  light: null,
  distance: null,
  motion: false,

  mood: "neutral",
  busyUntil: 0,

  // ===== modos
  mode: "manual",             // "manual" | "autonomo" | "troll"
  _trollTimers: [],
  _trollTelemId: null,

  async _notifyBackendMode(mode) {
    // opcional: avisar a tu microservicio (puerto 7000)
    try {
      await fetch("http://127.0.0.1:7000/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
    } catch {}
  },

  _queueTimer(fn, ms) {
    const id = setTimeout(fn, ms);
    set((s) => ({ _trollTimers: [...s._trollTimers, id] }));
  },
  _clearTrollQueue() {
    const ids = get()._trollTimers || [];
    ids.forEach(clearTimeout);
    set({ _trollTimers: [] });
  },

  // Distorsión de telemetría para modo troll
  _startTrollTelemetry() {
    if (get()._trollTelemId) return;
    const id = setInterval(() => {
      const s = get();
      const jitter = (v, amp) => (typeof v === "number" ? +(v + (Math.random()*2-1)*amp).toFixed(1) : v);

      // ruido suave
      const temperature = jitter(s.temperature, 0.6);
      const humidity    = jitter(s.humidity, 2.5);
      const light       = Math.max(0, Math.round(jitter(s.light ?? 200, 25)));

      // picos ocasionales de distancia (a veces “alguien cerca”)
      let distance = typeof s.distance === "number" ? s.distance : null;
      if (Math.random() < 0.18) distance = Math.max(3, Math.round((s.distance ?? 25) * 0.35));
      else if (typeof distance === "number") distance = Math.max(0, Math.round(jitter(distance, 3)));

      get().updateFromTelemetry({ temperature, humidity, light, distance, motion: Math.random() > 0.6 });
    }, 1200);
    set({ _trollTelemId: id });
  },
  _stopTrollTelemetry() {
    const id = get()._trollTelemId;
    if (id) clearInterval(id);
    set({ _trollTelemId: null });
  },

  setMode(mode) {
    // corta colas y efectos anteriores
    get()._clearTrollQueue();
    get()._stopTrollTelemetry();

    // modo → efectos
    if (mode === "troll") {
      useMoodStore.getState()?.setMood?.("troll");
      get()._startTrollTelemetry();
    }
    if (mode === "manual") {
      useMoodStore.getState()?.setMood?.("neutral");
    }
    if (mode === "autonomo") {
      // si querés que el front no intervenga: dejar sin efectos y que el firmware haga lo suyo.
      useMoodStore.getState()?.setMood?.("amigable");
    }

    set({ mode });
    get()._notifyBackendMode(mode);
  },

  setDuration(type, seconds) {
    if (type === "move") set({ movementDuration: clamp(Number(seconds) || 0, 0.5, 10) });
    if (type === "dance") set({ danceDuration: clamp(Number(seconds) || 0, 2, 60) });
  },
  setRandomIdle(val) { set({ randomIdle: !!val }); },

  async command(kind) {
    const now = Date.now();
    const { busyUntil, movementDuration, danceDuration, mode } = get();
    if (now < busyUntil) return false;

    const durations = {
      up: movementDuration,
      down: movementDuration,
      left: movementDuration,
      right: movementDuration,
      dance: danceDuration,
      stop: 0,
      take_picture: 1,
      spin: 2,
    };

    // si estás en "autonomo", igual dejamos mandar STOP y DANCE, el resto lo decide firmware
    const sequence =
      mode === "troll" ? trollPlan(kind)
      : mode === "autonomo" && !["stop", "dance"].includes(kind) ? [kind] // publica normal, el FW decide
      : [kind];

    const gap = 400;
    const totalMs = sequence.reduce((acc, k, i) => acc + (durations[k] ?? 1)*1000 + (i>0?gap:0), 0);

    get()._clearTrollQueue();
    let offset = 0;
    sequence.forEach((k, idx) => {
      get()._queueTimer(() => {
        const robotCmd = mapToRobot[k];
        if (robotCmd) sendRobotPlain(robotCmd);
        publishCmd(k, { seconds: durations[k] ?? 1 }); // tu JSON de app
        if (mode === "troll") {
          const moods = ["troll", "travieso", "confundido", "feliz"];
          useMoodStore.getState()?.setMood?.(moods[Math.floor(Math.random()*moods.length)]);
        }
      }, offset);
      offset += (durations[k] ?? 1)*1000 + gap;
    });

    set({ busyUntil: now + totalMs });
    return true;
  },

  updateFromTelemetry(t) {
    set((s) => ({
      battery: t.battery ?? s.battery,
      temperature: t.temperature ?? s.temperature,
      humidity: t.humidity ?? s.humidity,
      light: t.light ?? s.light,
      distance: t.distance ?? s.distance,
      motion: t.motion ?? s.motion,
      mood: t.mood ?? s.mood,
    }));
  },

  // mocks (dejá los tuyos como estaban)
  useMockTelemetry: false,
  _mockIntervalId: null,
  seedTelemetry() { /* igual */ },
  startMockTelemetry() { /* igual */ },
  stopMockTelemetry() { /* igual */ },

  startTelemetry() { /* igual */ },
}));
