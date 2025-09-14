// pages/graphic/Graphic.jsx
import { useEffect, useState, useMemo } from "react";
import { getCiudades, getDiaria, exportCsv } from "../../api/clima";
import CitySelect from "../../components/cityselect/CitySelect";
import DailyStrip from "../../components/daily/DailyStrip";
import DailyStripPro from "../../components/daily/DailyStripPro";
import DailyMixedChart from "../../components/dailymixed/DailyMixedChart";
import TodayKpis from "../../components/todayKPIs/TodayKpis";
import LoadingPage from "../../components/LoadingPage";
import SnowV3 from "../../components/SnowV3";
import AnimatedGradient from "../../components/AnimatedGradient";
import "./Graphic.css";

export default function GraficaDiaria() {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const [ciudadId, setCiudadId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const from = "2025-09-04";
  const to = "2025-09-15";


  const ciudad = { name: "Shanghai", lat: 31.2222, lon: 121.4581 };

  // Componente de nieve estático igual que en el login
  const StaticSnow = useMemo(
    () => (
      <SnowV3
        className="absolute inset-0 z-[1]"
        density={70}
        speed={1.1}
        color="#fff"
      />
    ),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const rows = await getCiudades();
        const sorted = (rows || []).sort(
          (a, b) => a.nombre.localeCompare(b.nombre, "es") // orden alfabético
        );
        setCities(sorted);
        if (sorted.length) setCiudadId(sorted[0].id);
      } finally {
        setLoadingCities(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ciudadId) return;

    // Evitar llamadas duplicadas si ya tenemos datos para esta ciudad
    const currentDataKey = `${ciudadId}-${from}-${to}`;
    const lastDataKey = localStorage.getItem("lastDataKey");

    if (currentDataKey === lastDataKey && data.length > 0) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const resp = await getDiaria({ ciudad_id: ciudadId, from, to });
        setData(resp || []);
        localStorage.setItem("lastDataKey", currentDataKey);
        setInitialLoadComplete(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [ciudadId, from, to]);

  // 👉 valor derivado optimizado con useMemo para evitar recálculos innecesarios
  const hoy = useMemo(() => {
    if (!data?.length) return null;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    const exact = data.find((d) => (d.fecha ?? "").startsWith(today));
    return exact ?? data[data.length - 1];
  }, [data]);

  if (loading && !initialLoadComplete)
    return <LoadingPage message="Cargando datos del clima..." />;

  return (
    <div className="weather-page">
      {loading && initialLoadComplete && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>Actualizando datos...</span>
        </div>
      )}
      {StaticSnow}
      <AnimatedGradient />
      <div className="weather-container">
        <div className="weather-section">
          <div className="section-title">Ciudad</div>
          {loadingCities ? (
            <div className="loading-cities">
              Cargando ciudades disponibles...
            </div>
          ) : (
            <CitySelect
              cities={cities}
              value={ciudadId}
              onChange={setCiudadId}
              disabled={loadingCities}
            />
          )}
        </div>

        <div className="weather-section">
          <div className="section-title">Condiciones Actuales</div>
          <TodayKpis d={hoy} />
        </div>
        <div className="weather-section ">
          <div className="section-title">Pronóstico</div>
          <DailyStripPro lat={ciudad.lat} lon={ciudad.lon} days={7} />
        </div>

        <div className="weather-section">
          <div className="section-title">Condiciones Previas</div>
          <DailyStrip data={data} />
        </div>

        <div className="weather-section">
          <div className="chart-header">
            <div className="section-title">Tendencias y Patrones</div>
            <button
              className="export-button-small"
              onClick={() => exportCsv({ ciudad_id: ciudadId, from, to })}
              title="Exportar datos a CSV"
            >
              📥 CSV
            </button>
          </div>
          <DailyMixedChart data={data} />
        </div>
      </div>
    </div>
  );
}
