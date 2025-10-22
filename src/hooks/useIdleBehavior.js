import { useEffect, useRef } from "react";
import { useRobotStore } from "../store/useRobotStore";

export function useIdleBehavior() {
  const { randomIdle, idleMin, idleMax, command } = useRobotStore();
  const timer = useRef();

  useEffect(() => {
    if (!randomIdle) return;

    function schedule() {
      const s = Math.floor(idleMin + Math.random() * (idleMax - idleMin));
      timer.current = setTimeout(() => {
        const acts = ["blink", "wink", "dance"];
        const act = acts[Math.floor(Math.random() * acts.length)];
        command(act);
        schedule();
      }, s * 1000);
    }
    schedule();
    return () => clearTimeout(timer.current);
  }, [randomIdle, idleMin, idleMax, command]);
}
