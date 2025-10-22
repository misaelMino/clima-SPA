import { useRobotStore } from "../../store/useRobotStore";
import SensorTile from "./SensorTile";

export default function SensorsPanel() {
  const { temperature, humidity, light, distance, battery, motion } =
    useRobotStore();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <SensorTile label="Temp" value={temperature} unit="°C" />
      <SensorTile label="Humedad" value={humidity} unit="%" />
      <SensorTile label="Luz" value={light} unit="lx" />
      <SensorTile label="Distancia" value={distance} unit="cm" />
      <SensorTile label="Batería" value={battery} unit="%" />
      <SensorTile label="Movimiento" value={motion ? "Sí" : "No"} />
    </div>
  );
}
