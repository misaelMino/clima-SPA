// src/components/daily/DailyStripPro.jsx
import { useEffect, useState } from "react";
import { fetchForecast } from "../../api/open-meteo";
import "./DailyStrip.css";

// Etiqueta de día sin desplazar (ya viene “local”, por eso usamos Z fijo)
function fmtDayLabel(isoYYYYMMDD) {
  return new Date(isoYYYYMMDD + "T00:00:00Z").toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

// Mostrar horas 00→23 locales: usamos localTs (ya trasladado) y lo formateamos en UTC
function fmtHourLocal(localTsMs) {
  return new Date(localTsMs).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
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
  const [data, setData] = useState([]); // [{ key, hours:[{localTs,...}], ... }]
  const [meta, setMeta] = useState({
    tzOffset: 0,
    tzName: "UTC",
    tzAbbr: "UTC",
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Pedimos +1 para poder ocultar “hoy” y seguir mostrando 3/7/14
        const resp = await fetchForecast({ lat, lon, days: range });
        setMeta({
          tzOffset: resp.tzOffset || 0,
          tzName: resp.tzName,
          tzAbbr: resp.tzAbbr,
        });

        // “Hoy” local de la ciudad (usando offset de la API)
        // const nowLocalMs = Date.now() + (resp.tzOffset || 0) * 1000;
        // const todayLocalKey = new Date(nowLocalMs).toISOString().slice(0, 10);

        // Sacamos el día actual y nos quedamos con los siguientes
        // const cleaned = resp.days.filter((d) => d.key !== todayLocalKey);

        setData(resp.days);

        if (selected && !cleaned.find((x) => x.key === selected.key))
          setSelected(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon, range]); // eslint-disable-line

  const handlePick = (d) =>
    setSelected((s) => (s && s.key === d.key ? null : d));

  function getDayLabelByIndex(dKey, index) {
    if (index === 0) return "HOY";
    if (index === 1) return "MAÑANA";
    return fmtDayLabel(dKey); 
  }

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

      {/* Cards de días */}
      <div
        className="daily-strip-wrapper"
        style={{
          justifyContent: data.length < 8 ? "center" : "flex-start",
        }}
      >
        {data.map((d, i) => (
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
            <span className="daily-day">{getDayLabelByIndex(d.key, i)}</span>
            <div className="daily-icon">
              {d.rainSum > 0 ? "🌧️" : d.cloudsAvg > 60 ? "☁️" : "☀️"}
            </div>
            <div className="flex flex-row">
              <div className="daily-temp-max">{Math.round(d.tmax)}°</div>
              <div className="daily-temp-mid">/</div>
              <div className="daily-temp-min">{Math.round(d.tmin)}°</div>
            </div>
            <div className="daily-wind">💨 {Math.round(d.windMax)} km/h</div>
            {d.rainSum > 0 && (
              <div className="daily-precip">💧 {d.rainSum.toFixed(1)} mm</div>
            )}
          </div>
        ))}
      </div>

      {/* Panel horario */}
      {selected && (
        <div className="daily-detail-panel">
          <div className="daily-detail-header">
            <span className="title">
              {fmtDayLabel(selected.key).toUpperCase()}
            </span>
            <span className="meta">
              {meta.tzName} ({meta.tzAbbr}) · Máx {Math.round(selected.tmax)}° ·
              Mín {Math.round(selected.tmin)}° · 💨{" "}
              {Math.round(selected.windMax)} km/h
              {selected.rainSum > 0
                ? ` · 💧 ${selected.rainSum.toFixed(1)} mm`
                : ""}
            </span>
          </div>

          <div className="daily-detail-scroll">
            {selected.hours.map((h) => (
              <div key={h.localTs} className="daily-detail-chip">
                <div className="h-time">{fmtHourLocal(h.localTs * 1000)}</div>
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
