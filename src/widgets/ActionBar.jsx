import { useRobotStore } from "../store/useRobotStore";

export default function ActionBar() {
  const { command } = useRobotStore();
  return (
    <div className="max-w-3xl mx-auto grid grid-cols-3 gap-2">
      <button className="retro-btn" onClick={() => command("dance")}>
        DANCE
      </button>
      <button className="retro-btn" onClick={() => command("stop")}>
        STOP
      </button>
      <button className="retro-btn" onClick={() => command("take_picture")}>
        TAKE PICTURE
      </button>
    </div>
  );
}
