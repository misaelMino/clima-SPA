export default function MessageBubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm
        ${
          isUser
            ? "bg-sky-600 text-white rounded-br-sm"
            : "bg-white/5 text-zinc-200 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
