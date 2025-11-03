import PixelCard from "../../components/ui/PixelCard";
import { useRobotStore } from "../../store/useRobotStore";
import { useEffect, useRef } from "react";
import buttonPng from "../../assets/button.png";
import "./control-pad.css";

export default function ControlPad() {
  const { command, movementDuration } = useRobotStore();
  const click = (k) => () => command(k);

  // Teclas en hold (para no duplicar mientras mantenés apretado)
  const pressedRef = useRef(new Set());

  useEffect(() => {
    const map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const setPressed = (dir, on) => {
      const el = document.querySelector(`.dpad-btn[data-dir="${dir}"]`);
      if (!el) return;
      el.classList.toggle("pressed", on);
    };

    const onKeyDown = (e) => {
      const dir = map[e.key];
      if (dir) {
        e.preventDefault(); // evita scroll
        if (pressedRef.current.has(e.key)) return; // ya estaba apretada
        pressedRef.current.add(e.key);
        setPressed(dir, true);
        command(dir); // ejecuta una vez al presionar
        return;
      }

      // Extras
      // Extras: solo bloquear si NO estoy escribiendo en un input/textarea
      const isTyping =
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable;

      if ((e.key === " " || e.key === "Enter") && !isTyping) {
        e.preventDefault();
        command("dance");
      } else if (e.key === "Escape") {
        e.preventDefault();
        command("stop");
      }
    };

    const onKeyUp = (e) => {
      const dir = map[e.key];
      if (dir) {
        pressedRef.current.delete(e.key);
        setPressed(dir, false);
      }
    };

    // capture:true para priorizar a nuestro handler aunque haya foco en otro lado
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
      pressedRef.current.clear();
    };
  }, [command]);

  return (
    <PixelCard className="grid place-items-center">
      <div className="dpad-wrapper">
        <div className="dpad" aria-label="Control pad">
          <button
            className="dpad-btn up"
            data-dir="up"
            tabIndex={-1}
            onClick={click("up")}
            aria-label="Arriba"
          >
            <span
              className="skin"
              style={{ backgroundImage: `url(${buttonPng})` }}
            />
          </button>

          <button
            className="dpad-btn left"
            data-dir="left"
            tabIndex={-1}
            onClick={click("left")}
            aria-label="Izquierda"
          >
            <span
              className="skin"
              style={{ backgroundImage: `url(${buttonPng})` }}
            />
          </button>

          <div className="dpad-center" />

          <button
            className="dpad-btn right"
            data-dir="right"
            tabIndex={-1}
            onClick={click("right")}
            aria-label="Derecha"
          >
            <span
              className="skin"
              style={{ backgroundImage: `url(${buttonPng})` }}
            />
          </button>

          <button
            className="dpad-btn down"
            data-dir="down"
            tabIndex={-1}
            onClick={click("down")}
            aria-label="Abajo"
          >
            <span
              className="skin"
              style={{ backgroundImage: `url(${buttonPng})` }}
            />
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-zinc-300">mov: {movementDuration}s</div>

      <div className="mt-3 grid grid-cols-2 gap-2 w-full">
        <button className="retro-btn retro-green" onClick={click("dance")}>
          DANCE
        </button>
        <button className="retro-btn retro-green" onClick={click("stop")}>
          STOP
        </button>
      </div>
    </PixelCard>
  );
}
