import { useMoodStore } from "./store/useMoodStore";

let ws;

export function initWS() {
  if (ws) return ws;

  ws = new WebSocket("ws://127.0.0.1:7000/ws");

  ws.onmessage = (ev) => {
    try {
      const { type, data } = JSON.parse(ev.data);
      if (type === "mood" && data?.mood) {
        useMoodStore.getState().setMood(data.mood);
      }
      if (type === "mode" && data?.active_mode) {
        useMoodStore.getState().setMode(data.active_mode);
      }
    } catch {}
  };

  ws.onclose = () => {
    setTimeout(initWS, 1200); // autoreconnect
  };

  return ws;
}
