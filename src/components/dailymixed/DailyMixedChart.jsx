import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from "recharts";

export default function DailyMixedChart({ data }) {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Temperatura y Precipitaciones</h3>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="fecha" 
            tickFormatter={(v)=>new Date(v).toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit' })}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            yAxisId="temp" 
            tick={{ fontSize: 12, fill: '#6b7280', angle: -90, textAnchor: "middle" }}
            axisLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: "°C", 
              angle: -90, 
              position: "insideLeft",
              style: { textAnchor: "middle" }
            }}
          />
          <YAxis 
            yAxisId="mm" 
            orientation="right" 
            tick={{ fontSize: 12, fill: '#6b7280', angle: 90, textAnchor: "middle" }}
            axisLine={{ stroke: '#d1d5db' }}
            label={{ 
              value: "mm", 
              angle: 90, 
              position: "insideRight",
              style: { textAnchor: "middle" }
            }}
          />
          <Tooltip 
            labelFormatter={(v)=>new Date(v).toLocaleDateString("es-AR", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              color: 'white',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
            labelStyle={{ color: '#e5e7eb', fontWeight: '600' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            yAxisId="mm" 
            dataKey="lluvia_mm" 
            stackId="mm" 
            name="Precipitaciones (mm)" 
            fill="url(#lluviaGradient)"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            yAxisId="mm" 
            dataKey="chaparrones_mm" 
            stackId="mm" 
            name="Chaparrones (mm)" 
            fill="url(#chaparronesGradient)"
            radius={[2, 2, 0, 0]}
          />
          <Line 
            yAxisId="temp" 
            type="monotone" 
            dataKey="tmin_c" 
            name="T° Mínima" 
            stroke="url(#tempMinGradient)"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
          />
          <Line 
            yAxisId="temp" 
            type="monotone" 
            dataKey="tmax_c" 
            name="T° Máxima" 
            stroke="url(#tempMaxGradient)"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: 'white' }}
          />
          <defs>
            <linearGradient id="lluviaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="chaparronesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e40af" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.7}/>
            </linearGradient>
            <linearGradient id="tempMinGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#60a5fa"/>
            </linearGradient>
            <linearGradient id="tempMaxGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444"/>
              <stop offset="100%" stopColor="#f87171"/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
