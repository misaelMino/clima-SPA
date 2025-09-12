import { useMemo } from "react";

const fmtDia = (iso) =>
  new Date(iso).toLocaleDateString("es-AR", { weekday: "short", day: "2-digit" });

export default function DailyStrip({ data }) {
  const items = useMemo(() => data.map(d => ({
    dia: fmtDia(d.fecha),
    tmin: Math.round(d.tmin_c),
    tmax: Math.round(d.tmax_c),
    viento: Math.round(d.viento_max_kmh),
    lluvia: +(d.lluvia_mm || 0),
    chap: +(d.chaparrones_mm || 0),
    nubo: Math.round(d.nubosidad_prom_pct || 0),
  })), [data]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {items.map((it, i) => (
          <div key={i} className="flex flex-col items-center bg-white rounded-2xl shadow p-3 w-28">
            <span className="text-sm text-gray-500">{it.dia}</span>
            {/* iconito simple por nubosidad/lluvia */}
            <div className="text-2xl">{(it.lluvia+it.chap)>0 ? "🌧️" : (it.nubo>60 ? "☁️" : "☀️")}</div>
            <div className="text-lg font-semibold">{it.tmax}°</div>
            <div className="text-xs text-gray-500">min {it.tmin}°</div>
            <div className="text-xs mt-1">💨 {it.viento} km/h</div>
            {(it.lluvia+it.chap)>0 && (
              <div className="text-xs mt-1">💧 {(it.lluvia+it.chap).toFixed(1)} mm</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
