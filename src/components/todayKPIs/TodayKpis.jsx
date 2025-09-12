export default function TodayKpis({ d }) {
  if (!d) return null;
  
  return (
    <div className="kpis-container">
      <div className="kpi-card">
        <div className="kpi-label">Temp. Máxima</div>
        <div className="kpi-icon">🌡️</div>
        <div className="kpi-value">{Math.round(d.tmax_c || 0)}°C</div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-label">Temp. Mínima</div>
        <div className="kpi-icon">❄️</div>
        <div className="kpi-value">{Math.round(d.tmin_c || 0)}°C</div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-label">Humedad Relativa</div>
        <div className="kpi-icon">💧</div>
        <div className="kpi-value">{Math.round(d.humedad_prom_pct || 0)}%</div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-label">Nubosidad</div>
        <div className="kpi-icon">☁️</div>
        <div className="kpi-value">{Math.round(d.nubosidad_prom_pct || 0)}%</div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-label">Viento Máximo</div>
        <div className="kpi-icon">💨</div>
        <div className="kpi-value">{Math.round(d.viento_max_kmh || 0)} Km/h</div>
      </div>
      
      <div className="kpi-card">
        <div className="kpi-label">Precipitaciones</div>
        <div className="kpi-icon">🌧️</div>
        <div className="kpi-value">{((d.lluvia_mm||0)+(d.chaparrones_mm||0)).toFixed(1)} mm</div>
      </div>
    </div>
  );
}
