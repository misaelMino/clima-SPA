import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid, Brush
} from "recharts";

export default function DailyMixedChart({ data = [], granularity = "1d", timeZone = "UTC" }) {
  // para series MUY largas, mostramos por defecto el último tramo
  const defaultWindow = granularity === "30m" ? 48 : granularity === "1h" ? 72 : 30; // ~1 día/3 días/1 mes aprox.
  const startIndex = Math.max(0, data.length - defaultWindow);

  const formatTick = (v) => {
    const d = new Date(v);
    if (granularity === "30m" || granularity === "1h") {
      return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone });
    }
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", timeZone });
  };

  const formatTooltip = (v) => {
    const d = new Date(v);
    if (granularity === "30m" || granularity === "1h") {
      return d.toLocaleString("es-ES", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", timeZone
      });
    }
    return d.toLocaleDateString("es-ES", {
      weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone
    });
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Temperatura y Precipitaciones</h3>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          barCategoryGap="35%"
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />

          <XAxis
            dataKey="fecha"
            tickFormatter={formatTick}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#d1d5db" }}
            interval="preserveStartEnd"
            minTickGap={12}
          />

          <YAxis
            yAxisId="temp"
            tick={{ fontSize: 12, fill: "#6b7280", angle: -90, textAnchor: "middle" }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: "°C", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
          />

          <YAxis
            yAxisId="mm"
            orientation="right"
            tick={{ fontSize: 12, fill: "#6b7280", angle: 90, textAnchor: "middle" }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: "mm", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
          />

          <Tooltip
            labelFormatter={formatTooltip}
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              color: "white",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            }}
            labelStyle={{ color: "#e5e7eb", fontWeight: "600" }}
          />

          <Legend wrapperStyle={{ paddingTop: "12px" }} iconType="circle" />

          <Bar
            yAxisId="mm"
            dataKey="lluvia_mm"
            stackId="mm"
            name="Precipitaciones (mm)"
            fill="url(#lluviaGradient)"
            radius={[2, 2, 0, 0]}
            minPointSize={1}
          />
          <Bar
            yAxisId="mm"
            dataKey="chaparrones_mm"
            stackId="mm"
            name="Chaparrones (mm)"
            fill="url(#chaparronesGradient)"
            radius={[2, 2, 0, 0]}
            minPointSize={1}
          />

          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tmin_c"
            name="T° Mínima"
            stroke="url(#tempMinGradient)"
            strokeWidth={3}
            dot={{ r: 3 }}
            connectNulls
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tmax_c"
            name="T° Máxima"
            stroke="url(#tempMaxGradient)"
            strokeWidth={3}
            dot={{ r: 3 }}
            connectNulls
          />

          {/* Navegación para series largas */}
          <Brush dataKey="fecha" startIndex={startIndex} travellerWidth={8} height={24} tickFormatter={formatTick} />

          <defs>
            <linearGradient id="lluviaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="chaparronesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e40af" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="tempMinGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="tempMaxGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
