import { useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Bubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs
        ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-white/5 text-zinc-200 rounded-bl-sm prose prose-invert prose-sm"
        }`}
      >
        {isUser ? (
          children
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default function ChatDock() {
  const { messages, addUser, addAssistant } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    addUser(text);
    setInput("");
    setLoading(true);
    try {
      const payload = {
        messages: messages.concat([{ role: "user", content: text }]),
      };
      const res = await fetch("http://127.0.0.1:7000/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      addAssistant(
        data.reply || data.assistant || "No entendí, probá otra vez."
      );
    } catch {
      addAssistant("No pude hablar con el agente. ¿Está levantado el backend?");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="bg-[#0f1522] border border-white/10 rounded-xl overflow-hidden flex flex-col h-80">
      <div className="px-3 py-2 text-xs text-zinc-400 border-b border-white/10">
        Chat con ButterBoi
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}
        {loading && (
          <div className="text-[11px] text-zinc-400 px-2">pensando…</div>
        )}
      </div>

      <div className="p-2 border-t border-white/10 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={2}
          className="flex-1 bg-white/5 rounded-md p-2 text-sm outline-none"
          placeholder="Preguntale algo al robot…"
        />
        <button
          onClick={send}
          className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
