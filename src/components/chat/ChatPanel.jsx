import { useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChatStore } from "../../store/useChatStore";
import { useSpeech } from "../../hooks/useSpeech";

export default function ChatPanel() {
  const { messages, addUser, addAssistant } = useChatStore();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [ttsOn, setTtsOn] = useState(false);
  const { hasSTT, hasTTS, startSTT, stopSTT, speak } = useSpeech();
  const taRef = useRef(null);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput("");

    // construimos historial sin system
    const payload = { messages: messages.concat([{ role: "user", content: text }]).map(m => ({
      role: m.role, content: m.content
    })) };

    const res = await fetch("http://127.0.0.1:7000/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    addAssistant(data.assistant);
    if (ttsOn) speak(data.assistant);
  };

  const onMic = () => {
    if (!hasSTT) return;
    if (!listening) {
      setListening(true);
      startSTT((t) => setInput(t));
    } else {
      setListening(false);
      stopSTT();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f16] text-white">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role}>{m.content}</MessageBubble>
        ))}
      </div>

      <div className="border-t border-white/10 p-2 flex items-end gap-2">
        <textarea
          ref={taRef}
          className="flex-1 bg-white/5 rounded-lg p-2 outline-none"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <div className="flex flex-col gap-2">
          <button
            className={`px-3 py-2 rounded-lg ${listening ? "bg-rose-600" : "bg-white/10 hover:bg-white/20"}`}
            onClick={onMic}
            disabled={!hasSTT}
            title={hasSTT ? "Dictado por voz" : "STT no disponible"}
          >
            🎤
          </button>
          <button
            className={`px-3 py-2 rounded-lg ${ttsOn ? "bg-emerald-600" : "bg-white/10 hover:bg-white/20"}`}
            onClick={() => setTtsOn(v => !v)}
            disabled={!hasTTS}
            title={hasTTS ? "Leer respuestas" : "TTS no disponible"}
          >
            🔊
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700"
            onClick={send}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
