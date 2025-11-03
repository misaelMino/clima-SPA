import { create } from "zustand";
import { publishCmd, getClient, topics } from "../mqtt/mqttClient";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const useRobotStore = create((set, get) => ({
  // UI prefs
  movementDuration: 2, // seconds
  danceDuration: 10,
  randomIdle: true,
  idleMin: 6, // seconds between random acts
  idleMax: 14,

  // Telemetry (valores iniciales neutrales)
  battery: null,
  temperature: null,
  humidity: null,
  light: null,
  distance: null,
  motion: false,

  mood: "neutral",
  busyUntil: 0,

  // nuevo: control de mocks
  useMockTelemetry: false,
  _mockIntervalId: null,

  setDuration(type, seconds) {
    if (type === "move")
      set({ movementDuration: clamp(Number(seconds) || 0, 0.5, 10) });
    if (type === "dance")
      set({ danceDuration: clamp(Number(seconds) || 0, 2, 60) });
  },

  setRandomIdle(val) {
    set({ randomIdle: !!val });
  },

  // Command dispatch with lockout
  async command(kind) {
    const now = Date.now();
    const { busyUntil } = get();
    if (now < busyUntil) return false; // still locked

    const { movementDuration, danceDuration } = get();
    const durations = {
      up: movementDuration,
      down: movementDuration,
      left: movementDuration,
      right: movementDuration,
      dance: danceDuration,
      take_picture: 1,
      stop: 0,
    };
    const seconds = durations[kind] ?? 1;

    publishCmd(kind, { seconds });
    set({ busyUntil: now + seconds * 1000 });
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

  // nuevo: set de valores 'hardcode' — uso puntual
  seedTelemetry() {
    set({
      battery: 87,
      temperature: 28.3,
      humidity: 61,
      light: 240,
      distance: 18,
      motion: true,
      mood: "happy",
    });
  },

  // nuevo: simulador periódico (cambia valores levemente cada segundo)
  startMockTelemetry(intervalMs = 1000) {
    // evita crear múltiples intervalos
    if (get()._mockIntervalId) return;
    set({ useMockTelemetry: true });
    const id = setInterval(() => {
      const s = get();
      // genera pequeñas fluctuaciones
      const jitter = (v, amp = 1) =>
        Math.round((v + (Math.random() * 2 - 1) * amp) * 10) / 10;

      // si hay null, inicializa con seed
      const baseTemp = s.temperature ?? 25;
      const baseHum = s.humidity ?? 50;
      const baseLight = s.light ?? 200;
      const baseDist = s.distance ?? 30;
      const baseBat = s.battery ?? 90;

      get().updateFromTelemetry({
        temperature: jitter(baseTemp, 0.5),
        humidity: Math.max(0, Math.min(100, jitter(baseHum, 2))),
        light: Math.max(0, Math.round(jitter(baseLight, 20))),
        distance: Math.max(0, Math.round(jitter(baseDist, 2))),
        battery: Math.max(0, Math.min(100, Math.round(baseBat - Math.random() * 0.01))),
        motion: Math.random() > 0.7,
      });
    }, intervalMs);
    set({ _mockIntervalId: id });
  },

  // nuevo: detener mock
  stopMockTelemetry() {
    const id = get()._mockIntervalId;
    if (id) {
      clearInterval(id);
      set({ _mockIntervalId: null, useMockTelemetry: false });
    }
  },

  startTelemetry() {
    const c = getClient();
    if (!c) {
      // si no hay cliente mqtt y estamos en modo dev, arrancamos mock automático
      if (process.env.NODE_ENV === "development") {
        // seed inicial y arranque de mock
        get().seedTelemetry();
        get().startMockTelemetry(1000);
      }
      return;
    }

    c.on("message", (topic, msg) => {
      if (!topic.startsWith("butterboi/telemetry")) return;
      try {
        const data = JSON.parse(msg.toString());
        get().updateFromTelemetry(data);
      } catch {}
    });
  },
}));
