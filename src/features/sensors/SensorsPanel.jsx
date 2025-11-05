import SensorTile from "./SensorTile";
import { useRobotStore } from "../../store/useRobotStore";

export default function SensorsPanel() {
  const { temperature, humidity, light, distance, motion } = useRobotStore();

  const sensors = [
    // label, value, unit, max, hint, color
    { label: "Temp,", value: temperature, unit: "°C", max: 50, hint: null, color: "bg-orange-400" },
    { label: "Hum.", value: humidity, unit: "%", max: 100, hint: null, color: "bg-blue-400" },
    { label: "Dist.", value: distance, unit: "cm", max: 200, hint: null, color: "bg-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {sensors.map((s) => (
        <SensorTile
          key={s.label}
          label={s.label}
          value={s.value}
          unit={s.unit}
          max={s.max}
          hint={s.hint}
          barColor={s.color}
        />
      ))}
    </div>
  );
}
