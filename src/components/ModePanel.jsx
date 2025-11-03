export default function ModePanel() {
  const setMode = async (mode) => {
    await fetch("http://127.0.0.1:7000/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
  };

  const setMood = async (mood) => {
    await fetch("http://127.0.0.1:7000/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, source: "ui" }),
    });
  };

  return (
    <div className="flex gap-2 p-2 bg-black/20 rounded-lg text-xs">
      <button onClick={() => setMode("manual")}>Manual</button>
      <button onClick={() => setMode("random")}>Random</button>
      <button onClick={() => setMode("troll")}>Troll</button>

      <button onClick={() => setMood("feliz")}>🙂</button>
      <button onClick={() => setMood("pixel")}>🟥</button>
      <button onClick={() => setMood("dofon")}>🤪</button>
    </div>
  );
}
