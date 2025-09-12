import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from "recharts";

export default function DailyMixedChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Temperatura y precipitación</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" tickFormatter={(v)=>new Date(v).toLocaleDateString("es-AR")} />
          <YAxis yAxisId="temp" />
          <YAxis yAxisId="mm" orientation="right" />
          <Tooltip labelFormatter={(v)=>new Date(v).toLocaleDateString("es-AR")} />
          <Legend />
          <Bar yAxisId="mm" dataKey="lluvia_mm" stackId="mm" name="Lluvia (mm)" />
          <Bar yAxisId="mm" dataKey="chaparrones_mm" stackId="mm" name="Chaparrones (mm)" />
          <Line yAxisId="temp" type="monotone" dataKey="tmin_c" name="T° Mín" stroke="#3b82f6" />
          <Line yAxisId="temp" type="monotone" dataKey="tmax_c" name="T° Máx" stroke="#ef4444" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
