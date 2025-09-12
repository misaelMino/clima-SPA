// src/components/Snow.jsx
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Snow({
  density = 80,         // cantidad
  speed = 1.2,          // velocidad de caída
  color = "#ffffff",    // color copitos
  className = "",       // para posicionarlo (z-index, absolute, etc.)
}) {
  const init = async (engine) => { await loadFull(engine); };

  return (
    <Particles
      id="snow"
      init={init}
      className={"pointer-events-none " + className} // no bloquea clics
      options={{
        fullScreen: { enable: false },              // lo controlamos con CSS
        background: { color: "transparent" },
        detectRetina: true,
        fpsLimit: 60,
        particles: {
          number: { value: density, density: { enable: true, area: 800 } },
          color: { value: color },
          shape: { type: "circle" },
          opacity: { value: { min: 0.2, max: 0.7 } },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            direction: "bottom",
            speed,
            straight: false,
            outModes: { default: "out" },
            drift: 0,           // probá 0.2 si querés que “zigzaguee”
            gravity: { enable: false },
          },
        },
      }}
    />
  );
}
