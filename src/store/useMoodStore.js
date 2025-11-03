import { create } from "zustand";

export const useMoodStore = create((set) => ({
  mood: "feliz",
  mode: "manual",
  setMood: (mood) => set({ mood }),
  setMode: (mode) => set({ mode }),
}));
