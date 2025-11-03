import ChatPanel from "../components/chat/ChatPanel";
import TopBar from "../widgets/TopBar";

export default function AgentChat() {
  return (
    <div className="min-h-screen bg-[#0b0f16]">
      <TopBar />
      <div className="max-w-3xl mx-auto h-[calc(100vh-60px)]">
        <ChatPanel />
      </div>
    </div>
  );
}
