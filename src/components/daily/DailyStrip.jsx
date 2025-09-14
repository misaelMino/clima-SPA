import { useMemo } from "react";
import './DailyStrip.css'


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
    <div className="daily-strip-container">
      <div className="daily-strip-wrapper">
        {items.map((it, i) => (
          <div key={i} className="daily-card">
            <span className="daily-day">{it.dia}</span>
            <div className="daily-icon">{(it.lluvia+it.chap)>0 ? "🌧️" : (it.nubo>60 ? "☁️" : "☀️")}</div>
            <div className="daily-temp-max">{it.tmax}°</div>
            <div className="daily-temp-min">min {it.tmin}°</div>
            <div className="daily-wind">💨 {it.viento} km/h</div>
            {(it.lluvia+it.chap)>0 && (
              <div className="daily-precip">💧 {(it.lluvia+it.chap).toFixed(1)} mm</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
