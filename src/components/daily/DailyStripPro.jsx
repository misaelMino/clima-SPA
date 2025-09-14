// src/components/daily/DailyStripPro.jsx
import { useEffect, useState, useMemo } from "react";
import { fetchForecast } from "../../api/open-meteo";
import "./DailyStrip.css";

function fmtDayLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "2-digit" });
}
function fmtHour(ts) {
  return new Date(ts * 1000).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function WindArrow({ deg }) {
  return (
    <span
      title={`${deg}°`}
      style={{ display: "inline-block", transform: `rotate(${deg}deg)` }}
    >
      ➤
    </span>
  );
}

export default function DailyStripPro({ lat, lon, days = 7 }) {
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(days);
  const [data, setData] = useState([]); // [{ key, hours, tmin, tmax, windMax, rainSum, cloudsAvg }]
  const [selected, setSelected] = useState(null); // guarda el día seleccionado (objeto d)

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await fetchForecast({ lat, lon, days: range });
        setData(resp.days);
        // si el seleccionado no existe más en el nuevo rango, lo limpiamos
        if (selected && !resp.days.find((x) => x.key === selected.key)) {
          setSelected(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon, range]); // eslint-disable-line

  const handlePick = (d) =>
    setSelected((s) => (s && s.key === d.key ? null : d));

  return (
    <div className="daily-strip-container">
      {/* Filtros 3/7/14 */}
      <div
        className="flex gap-2 mb-3 days-filter"
        role="tablist"
        aria-label="Rango de pronóstico"
      >
        {[3, 7, 14].map((n) => (
          <button
            key={n}
            role="tab"
            aria-selected={range === n}
            disabled={loading}
            className={`btn ${range === n ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setRange(n)}
          >
            {n} días
          </button>
        ))}
      </div>

      {/* Carrusel de días */}
      <div className="daily-strip-wrapper">
        {data.map((d) => (
          <div
            key={d.key}
            role="button"
            tabIndex={0}
            onClick={() => handlePick(d)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handlePick(d)
            }
            className="daily-card"
            style={{
              cursor: "pointer",
              outline: selected?.key === d.key ? "2px solid #60a5fa" : "none",
            }}
          >
            <span className="daily-day">{fmtDayLabel(d.key)}</span>
            <div className="daily-icon">
              {d.rainSum > 0 ? "🌧️" : d.cloudsAvg > 60 ? "☁️" : "☀️"}
            </div>
            <div className="daily-temp-max">{Math.round(d.tmax)}°</div>
            <div className="daily-temp-min">min {Math.round(d.tmin)}°</div>
            <div className="daily-wind">💨 {Math.round(d.windMax)} km/h</div>
            {d.rainSum > 0 && (
              <div className="daily-precip">💧 {d.rainSum.toFixed(1)} mm</div>
            )}
          </div>
        ))}
      </div>

      {/* Panel de detalle horario debajo */}
      {selected && (
        <div className="daily-detail-panel">
          <div className="daily-detail-header">
            <span className="title">
              {fmtDayLabel(selected.key).toUpperCase()}
            </span>
            <span className="meta">
              Máx {Math.round(selected.tmax)}° · Mín {Math.round(selected.tmin)}
              ° · 💨 {Math.round(selected.windMax)} km/h
              {selected.rainSum > 0
                ? ` · 💧 ${selected.rainSum.toFixed(1)} mm`
                : ""}
            </span>
          </div>

          <div className="daily-detail-scroll">
            {selected.hours.map((h) => (
              <div key={h.ts} className="daily-detail-chip">
                <div className="h-time">{fmtHour(h.ts)}</div>
                <div className="h-temp">{Math.round(h.temp)}°</div>
                <div className="h-feels">Térmica {Math.round(h.feels)}°</div>
                <div className="h-rh">HR {h.rh}%</div>
                <div className="h-wind">
                  Viento {Math.round(h.wind)} km/h <WindArrow deg={h.windDir} />
                </div>
                <div className="h-pp">Prob. {h.ppop ?? 0}%</div>
                {h.rain + h.showers > 0 && (
                  <div className="h-rain">
                    Lluvia {(h.rain + h.showers).toFixed(1)} mm
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
