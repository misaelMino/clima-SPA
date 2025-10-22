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

  // Telemetry
  battery: null,
  temperature: null,
  humidity: null,
  light: null,
  distance: null,
  motion: false,

  mood: "neutral", // current face key
  busyUntil: 0, // epoch ms

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

  startTelemetry() {
    const c = getClient();
    c.on("message", (topic, msg) => {
      if (!topic.startsWith("butterboi/telemetry")) return;
      try {
        const data = JSON.parse(msg.toString());
        get().updateFromTelemetry(data);
      } catch {}
    });
  },
}));
