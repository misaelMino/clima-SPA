import { useRobotStore } from "../store/useRobotStore";

export default function ModePanel() {
  const mode = useRobotStore((s) => s.mode);
  const setMode = useRobotStore((s) => s.setMode);

  const setMood = async (mood) => {
    try {
      await fetch("http://127.0.0.1:7000/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, source: "ui" }),
      });
    } catch {}
  };

  const btn = (m) =>
    `px-2 py-1 rounded-md border ${
      mode === m ? "bg-lime-400/80 text-black border-lime-300" : "bg-black/30 border-white/10 hover:bg-white/10"
    }`;

  return (
    <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg text-xs">
      <span className="opacity-70 mr-1">Modo:</span>
      <button className={btn("manual")}   onClick={() => setMode("manual")}>Manual</button>
      <button className={btn("autonomo")} onClick={() => setMode("autonomo")}>Autónomo (FW)</button>
      <button className={btn("troll")}    onClick={() => setMode("troll")}>Troll 😈</button>

      <span className="opacity-70 mx-2">|</span>
      <span className="opacity-70 mr-1">Mood:</span>
      <button onClick={() => setMood("feliz")}>🙂</button>
      <button onClick={() => setMood("pixel")}>🟥</button>
      <button onClick={() => setMood("dofon")}>🤪</button>

      {mode === "troll" && (
        <span className="ml-2 text-[10px] px-2 py-[2px] rounded bg-yellow-400/20 border border-yellow-400/40">
          ⚠️ Modo troll activo: movimientos alterados y telemetría traviesa
        </span>
      )}
    </div>
  );
}
