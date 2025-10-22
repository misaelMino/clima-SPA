import { useEffect } from "react";
import { useRobotStore } from "../store/useRobotStore";
import { useIdleBehavior } from "../hooks/useIdleBehavior";
import ControlPad from "../features/control/ControlPad";
import MoodFace from "../features/gestures/MoodFace";
import SensorsPanel from "../features/sensors/SensorsPanel";
import SettingsSheet from "../features/settings/SettingsSheet";
import TopBar from "../widgets/TopBar";
import CameraPanel from "../features/camera/CameraPanel";
import ActionBar from "../widgets/ActionBar";

export default function Home() {
  const startTelemetry = useRobotStore((s) => s.startTelemetry);
  useEffect(() => {
    startTelemetry();
  }, [startTelemetry]);
  useIdleBehavior();

  return (
    <div className="min-h-screen w-full bg-[#0b0f16] text-white p-3">
      <TopBar />

      {/* Responsive layout: */}
      {/* lg: 12 cols => izquierda (gestos+mando) 3, centro cámara 6, derecha (sensores+config) 3 */}
      <main className="max-w-7xl mx-auto grid gap-3 lg:grid-cols-12">
        {/* IZQUIERDA: Gestos arriba + mando abajo */}
        <section className="grid gap-3 lg:col-span-3">
          {/* Gestos (cara/sprite) */}
          <MoodFace spriteSheet="/assets/faces.png" mood="neutral" />
          {/* Mando */}
          <ControlPad />
        </section>

        {/* CENTRO: Cámara */}
        <section className="lg:col-span-6">
          <CameraPanel />
        </section>

        {/* DERECHA: Sensores + Config */}
        <aside className="grid gap-3 lg:col-span-3">
          <SensorsPanel />
          <SettingsSheet />
        </aside>

        {/* Barra de acciones centrada bajo la cámara (ocupa las 12 cols en desktop) */}
        <div className="lg:col-span-12">
          <ActionBar />
        </div>
      </main>

      <div className="h-4" />
    </div>
  );
}
