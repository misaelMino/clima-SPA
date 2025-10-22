import PixelCard from "../../components/ui/PixelCard";
import { useRobotStore } from "../../store/useRobotStore";

export default function SettingsSheet() {
  const {
    movementDuration,
    danceDuration,
    setDuration,
    randomIdle,
    setRandomIdle,
  } = useRobotStore();
  return (
    <PixelCard>
      <div className="text-sm mb-2 text-zinc-300">Config</div>
      <div className="grid gap-2">
        <label className="text-xs text-zinc-400">Duración movimiento (s)</label>
        <input
          className="retro-input"
          type="number"
          min="0.5"
          max="10"
          step="0.5"
          value={movementDuration}
          onChange={(e) => setDuration("move", e.target.value)}
        />

        <label className="text-xs text-zinc-400 mt-2">Duración baile (s)</label>
        <input
          className="retro-input"
          type="number"
          min="2"
          max="60"
          step="1"
          value={danceDuration}
          onChange={(e) => setDuration("dance", e.target.value)}
        />

        <label className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={randomIdle}
            onChange={(e) => setRandomIdle(e.target.checked)}
          />{" "}
          Comportamientos aleatorios en pausa
        </label>
      </div>
    </PixelCard>
  );
}
