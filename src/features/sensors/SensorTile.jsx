import PixelCard from "../../components/ui/PixelCard";

export default function SensorTile({
  label,
  value,
  unit,
  max = 100,
  barColor = "bg-sky-400",
  compact = false, // si lo pasas true hace todo aún más pequeño
}) {
  // Normalizar valor numérico si es posible
  let numericValue = null;

  if (typeof value === "number" && Number.isFinite(value)) {
    numericValue = value;
  } else if (typeof value === "string") {
    const n = parseFloat(value);
    numericValue = Number.isFinite(n) ? n : null;
  } else if (typeof value === "boolean") {
    numericValue = value ? 1 : 0;
  } else {
    numericValue = null;
  }

  const pct =
    numericValue == null
      ? 0
      : Math.max(0, Math.min(100, (numericValue / max) * 100));

  // Formateo del texto a mostrar
  let displayText;
  if (value == null) {
    displayText = "—";
  } else if (typeof value === "boolean") {
    displayText = value ? "Sí" : "No";
  } else if (numericValue == null) {
    displayText = String(value);
  } else {
    displayText =
      Math.abs(numericValue) >= 100
        ? String(Math.round(numericValue))
        : String(Math.round(numericValue * 10) / 10);
  }

  // tamaños según compact flag
  const labelClass = compact ? "text-[10px]" : "text-xs";
  const valueClass = compact ? "text-sm" : "text-sm"; // mantenemos text-sm; podés cambiar a text-base si querés
  const unitClass = compact ? "text-[10px]" : "text-sm";

  return (
    <PixelCard className="flex flex-col items-center justify-end py-2">
      {/* Encabezado: usamos min-w-0 + truncate para que no "escape" del flex */}
      <div className="w-full flex items-center justify-center mb-2 px-1 min-w-0">
        <div className="flex flex-col items-center min-w-0">
          <div
            className={`${labelClass} text-zinc-400 leading-tight truncate max-w-[6rem]`}
            title={label}
          >
            {label}
          </div>

          <div
            className={`mt-1 ${valueClass} font-semibold text-white leading-tight truncate max-w-[6rem]`}
          >
            {/* valor + unidad en la misma linea; unit en span pequeño */}
            <span className="inline-block align-baseline truncate">
              {displayText}
            </span>
            {unit && typeof value !== "boolean" ? (
              <span
                className={`${unitClass} text-zinc-400 ml-1 inline-block align-baseline`}
              >
                {unit}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Contenedor de la barra */}
      <div className="relative h-24 w-5 bg-zinc-900 border-2 border-zinc-600 overflow-hidden">
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-out ${barColor}`}
          style={{ height: `${pct}%` }}
        />
      </div>
    </PixelCard>
  );
}
