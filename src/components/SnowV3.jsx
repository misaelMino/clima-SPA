// SnowV3.jsx
import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function SnowV3({ density = 80, speed = 1.2, color = "#ffffff", className = "" }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: "transparent" },
    detectRetina: true,
    fpsLimit: 60,
    particles: {
      number: { value: density, density: { enable: true, area: 800 } },
      color: { value: color },
      shape: { type: "circle" },
      opacity: { value: { min: 0.2, max: 0.7 } },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, direction: "bottom", speed, outModes: { default: "out" } },
    },
  }), [density, speed, color]); // <- solo cambia si cambian estos props (primitivos)

  if (!ready) return null;
  return <Particles id="snow" className={"pointer-events-none " + className} options={options} />;
}

export default React.memo(SnowV3);
