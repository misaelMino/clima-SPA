import axios from "axios";

const BASE = "https://api.open-meteo.com/v1/forecast";
const HOURLY =
  "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m";


export async function fetchForecast({ lat, lon, days = 7 }) {
  const { data } = await axios.get(BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: HOURLY,
      forecast_days: days,
      timeformat: "unixtime",   // devolveme UNIX
      timezone: "auto",         // 👈 timezone según coordenadas
    },
  });

  const tzOffset = data.utc_offset_seconds ?? 0;         // 👈 offset local en segundos
  const tzName   = data.timezone || "UTC";
  const tzAbbr   = data.timezone_abbreviation || "UTC";

  // ---- normalizar horas (aplicando offset para mostrar/agrupación local)
  const H = data.hourly || {};
  const hours = (H.time || []).map((ts, i) => ({
    ts,                                   // unix (UTC)
    localTs: ts + tzOffset,               // 👈 unix ajustado a hora local de la ciudad
    temp: H.temperature_2m?.[i] ?? null,
    feels: H.apparent_temperature?.[i] ?? null,
    rh: H.relative_humidity_2m?.[i] ?? null,
    ppop: H.precipitation_probability?.[i] ?? null,
    rain: H.rain?.[i] ?? 0,
    showers: H.showers?.[i] ?? 0,
    snow: H.snowfall?.[i] ?? 0,
    clouds: H.cloud_cover?.[i] ?? null,
    wind: H.wind_speed_10m?.[i] ?? null,
    windDir: H.wind_direction_10m?.[i] ?? null,
  }));

  // ---- agrupar por día usando localTs
  const byDay = new Map();
  for (const h of hours) {
    const d = new Date(h.localTs * 1000);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD (ya en local de la ciudad)
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(h);
  }

  // ---- resumen diario para card
  const daysArr = Array.from(byDay.entries()).map(([key, arr]) => {
    const tmin = Math.min(...arr.map(x => x.temp));
    const tmax = Math.max(...arr.map(x => x.temp));
    const windMax = Math.max(...arr.map(x => x.wind ?? 0));
    const rainSum = arr.reduce((a, x) => a + (x.rain ?? 0) + (x.showers ?? 0), 0);
    const cloudsAvg = Math.round(
      arr.reduce((a, x) => a + (x.clouds ?? 0), 0) / (arr.length || 1)
    );
    return { key, hours: arr, tmin, tmax, windMax, rainSum, cloudsAvg };
  });

  return {
    days: daysArr,
    hoursUnits: data.hourly_units || {},
    tzOffset, tzName, tzAbbr,              // 👈 devolver info de timezone
  };
}
