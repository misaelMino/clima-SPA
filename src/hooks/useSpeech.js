import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  messages: [
    { role: "assistant", content: "¡Hola! Soy el agente de ButterBoi 👋" }
  ],
  addUser: (content) => set({ messages: [...get().messages, { role: "user", content }] }),
  addAssistant: (content) => set({ messages: [...get().messages, { role: "assistant", content }] }),
  clear: () => set({ messages: [] }),
}));
