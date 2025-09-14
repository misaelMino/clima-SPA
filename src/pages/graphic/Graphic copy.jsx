// pages/graphic/Graphic.jsx
import { useEffect, useState, useMemo, useRef } from "react";
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
  const [loadingCities, setLoadingCities] = useState(true);
  const [cities, setCities] = useState([]);
  const [ciudadId, setCiudadId] = (useState < number) | (null > null);
  const [ciudadAltitud, setCiudadAltitud] = useState("");
  const [ciudadLongitud, setCiudadLongitud] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const startTime = Date.now();
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
        const sorted = (rows || []).sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es")
        );
        setCities(sorted);
        // console.log('rows', rows);
        // if (sorted.length) setCiudadId(sorted[0].id);
      } finally {
        // esto es una negrada para que la carga tarde como minimo 2.5seg
        const elapsed = Date.now() - startTime;
        const min = 2800;
        const remaining = Math.max(min - elapsed, 0);

        setTimeout(() => {
          setLoadingCities(false);
        }, remaining);
      }
    })();
  }, []);

  useEffect(() => {
    // if (!ciudadId) {
    //   // ⬅️ sin ciudad, no pidas nada
    //   setData([]);
    //   setInitialLoadComplete(false);
    //   return;
    // }

    const currentDataKey = `${ciudadId}-${from}-${to}`;
    const lastDataKey = localStorage.getItem("lastDataKey");

    if (currentDataKey === lastDataKey && data.length > 0) {
      setLoading(false);
      return;
    }

    (async () => {
      if (cities && !ciudadId) {
        setLoading(false);
        return;
      }

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

  if (cities && loadingCities)
    return <LoadingPage message="Cargando datos del clima..." />;

  // if (loading && !initialLoadComplete)
  //   return <LoadingPage message="Cargando datos del clima..." />;

  return (
    <div className="weather-page">
      {loading && initialLoadComplete && (
        // <div className="loading-indicator">
        //   <div className="loading-spinner"></div>
        //   <span>Actualizando datos...</span>
        // </div>

        <LoadingPage message="Actualizando información..." />
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

        {!ciudadId ? (
          <div className="mt-6 rounded-xl border border-white/10 p-6 text-center text-white/70">
            Elija una ciudad para ver información.
          </div>
        ) : (
          <>
            <div className="weather-section">
              <div className="section-title">Hoy</div>
              <TodayKpis d={hoy} />
            </div>
            <div className="weather-section ">
              <div className="section-title">Pronóstico extendido</div>
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
          </>
        )}
      </div>
    </div>
  );
}
