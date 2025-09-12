// pages/graphic/Graphic.jsx
import { useEffect, useState } from "react";
import { getCiudades, getDiaria, exportCsv } from "../../api/clima";
import CitySelect from "../../components/cityselect/CitySelect";
import DailyStrip from "../../components/daily/DailyStrip";
import DailyMixedChart from "../../components/dailymixed/DailyMixedChart";
import TodayKpis from "../../components/todayKPIs/TodayKpis";

export default function GraficaDiaria() {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const [ciudadId, setCiudadId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = "2025-09-04";
  const to   = "2025-09-15";

  useEffect(() => {
    (async () => {
      try {
        setLoadingCities(true);
        const rows = await getCiudades();
        setCities(rows || []);
        if (rows?.length) setCiudadId(rows[0].id);
      } finally { setLoadingCities(false); }
    })();
  }, []);

  useEffect(() => {
    if (!ciudadId) return;
    (async () => {
      try {
        setLoading(true);
        const resp = await getDiaria({ ciudad_id: ciudadId, from, to });
        setData(resp || []);
      } finally { setLoading(false); }
    })();
  }, [ciudadId, from, to]);

  // 👉 valor derivado SIN hooks
  const hoy = (() => {
    if (!data?.length) return null;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    const exact = data.find(d => (d.fecha ?? "").startsWith(today));
    return exact ?? data[data.length - 1];
  })();

  if (loading && !data.length) return <div className="p-4">Cargando…</div>;

  return (
    <div className="p-4 space-y-6">
      <CitySelect
        cities={cities}
        value={ciudadId}
        onChange={setCiudadId}
        disabled={loadingCities}
      />

      <div>
        <span className="block text-sm text-gray-600 mb-2">Diario pa’ trás</span>
        <DailyStrip data={data} />
      </div>

      <div>
        <span className="block text-sm text-gray-600 mb-2">EL CLIMA HOY</span>
        <TodayKpis d={hoy} />
      </div>

      <div>
        <span className="block text-sm text-gray-600 mb-2">GRÁFICO POR RANGO DE TIEMPO</span>
        <DailyMixedChart data={data} />
      </div>

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => exportCsv({ ciudad_id: ciudadId, from, to, filename: "diaria_sep.csv" })}
      >
        Exportar CSV
      </button>
    </div>
  );
}
