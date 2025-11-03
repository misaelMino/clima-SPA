import { useNavigate } from "react-router-dom";
import { Settings, BarChart3 } from "lucide-react";

export default function TopBar() {
  const nav = useNavigate();
  return (
    <header className="max-w-7xl mx-auto flex items-center justify-between py-2">
      <div className="text-xs text-zinc-400">ButterBoi</div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
          onClick={() => nav("/home")}
          aria-label="Dashboard"
        >
          <BarChart3 size={16} />
        </button>
        <button
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
          onClick={() => nav("/settings")}
          aria-label="Opciones"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
