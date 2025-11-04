import { useEffect } from "react";
import { useRobotStore } from "../store/useRobotStore";
import { useIdleBehavior } from "../hooks/useIdleBehavior";
import { useSyncMe } from "../hooks/useSyncMe";
import ControlPad from "../features/control/ControlPad";
import MoodFace from "../features/gestures/MoodFace";
import { getClient } from "../mqtt/mqttClient";
import SensorsPanel from "../features/sensors/SensorsPanel";
import SettingsSheet from "../features/settings/SettingsSheet";
import TopBar from "../widgets/TopBar";
import CameraPanel from "../features/camera/CameraPanel";
import ActionBar from "../widgets/ActionBar";
import ModePanel from "../components/ModePanel";
import { useMoodStore } from "../store/useMoodStore";
import ChatDock from "../components/chat/ChatDock";

export default function Home() {
  useSyncMe();

  const mood = useMoodStore((s) => s.mood);

  useEffect(() => {
    getClient(); // inicia conexión y suscripción
  }, []);

  
  const startTelemetry = useRobotStore((s) => s.startTelemetry);
  const seedTelemetry = useRobotStore((s) => s.seedTelemetry);
  const startMockTelemetry = useRobotStore((s) => s.startMockTelemetry);
  const stopMockTelemetry = useRobotStore((s) => s.stopMockTelemetry);

  // decide si usar mock: can be env based or manual toggle
  const enableMock =
    process.env.NODE_ENV === "development" ||
    window.location.search.includes("mock=1");

  useEffect(() => {
    // Siempre intenta conectar el cliente real (si está disponible)
    startTelemetry();

    // Seed y mock solo si queremos
    seedTelemetry();
    if (enableMock) startMockTelemetry(3000);

    return () => {
      // limpiar intervalos de mock al desmontar
      if (enableMock) stopMockTelemetry();
      // si más adelante startTelemetry instala listeners, recuerda que
      // startTelemetry debería exponer una forma de desconectar (ideal).
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar

  useIdleBehavior();

  return (
    <div className="min-h-screen w-full bg-[#0b0f16] text-white p-3">
      <TopBar />
      <main className="max-w-7xl mx-auto grid gap-3 lg:grid-cols-12">
        <section className="grid gap-3 lg:col-span-3">
          <MoodFace mood={mood} size={160} />
          <ControlPad />
        </section>
        <section className="lg:col-span-6">
          <CameraPanel />
          <div className="w-full flex py-2 justify-center align-middle">
            <ActionBar />
          </div>
        </section>
        <aside className="flex flex-col gap-3 lg:col-span-3 w-full">
          <SensorsPanel />
          <div className="flex flex-col gap-2 p-2">
            <ModePanel />
            <ChatDock />
          </div>
        </aside>

        <div className="lg:col-span-12"></div>
      </main>
      <div className="h-4" />
    </div>
  );
}
