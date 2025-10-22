import PixelCard from "../../components/ui/PixelCard";

export default function SensorTile({ label, value, unit, hint }) {
  return (
    <PixelCard>
      <div className="flex items-baseline gap-2">
        <div className="text-xs text-zinc-400">{label}</div>
        {hint && <div className="text-[10px] text-zinc-500">{hint}</div>}
      </div>
      <div className="mt-1 text-2xl font-bold tracking-tight">
        {value ?? "—"}
        {value != null && unit ? (
          <span className="text-sm font-medium ml-1">{unit}</span>
        ) : null}
      </div>
    </PixelCard>
  );
}
