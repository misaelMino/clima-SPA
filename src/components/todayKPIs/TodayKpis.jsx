export default function TodayKpis({ d }) {
  if (!d) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">Humedad prom.</div>
        <div className="text-xl font-semibold">{Math.round(d.humedad_prom_pct || 0)}%</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">Nubosidad prom.</div>
        <div className="text-xl font-semibold">{Math.round(d.nubosidad_prom_pct || 0)}%</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">Viento máx</div>
        <div className="text-xl font-semibold">{Math.round(d.viento_max_kmh || 0)} km/h</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">Precipitación</div>
        <div className="text-xl font-semibold">{((d.lluvia_mm||0)+(d.chaparrones_mm||0)).toFixed(1)} mm</div>
      </div>
    </div>
  );
}
