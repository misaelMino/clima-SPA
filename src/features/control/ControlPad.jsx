import PixelCard from "../../components/ui/PixelCard";
import { useRobotStore } from "../../store/useRobotStore";
import "./control-pad.css";

export default function ControlPad() {
  const { command, movementDuration } = useRobotStore();

  const click = (k) => () => command(k);

  return (
    <PixelCard className="grid place-items-center">
      <div className="dpad" aria-label="Control pad">
        <button
          className="dpad-btn up"
          onClick={click("up")}
          aria-label="Arriba"
        />
        <button
          className="dpad-btn left"
          onClick={click("left")}
          aria-label="Izquierda"
        />
        <button
          className="dpad-btn right"
          onClick={click("right")}
          aria-label="Derecha"
        />
        <button
          className="dpad-btn down"
          onClick={click("down")}
          aria-label="Abajo"
        />
      </div>
      <div className="mt-2 text-xs text-zinc-300">mov: {movementDuration}s</div>
      <div className="mt-3 grid grid-cols-2 gap-2 w-full">
        <button className="retro-btn" onClick={click("dance")}>
          DANCE
        </button>
        <button className="retro-btn" onClick={click("stop")}>
          STOP
        </button>
      </div>
    </PixelCard>
  );
}
