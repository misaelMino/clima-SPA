// src/pages/login/LoginPage.jsx
import { useAuth } from "../../context/AuthContext";
import "./login-pixel.css";
import ButterRobotFace from "../../components/ButterRobotFace";

export default function LoginPixel() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-grid flex items-center justify-center p-4">
        <div className="pixel-card w-full max-w-md">Cargando…</div>
      </div>
    );
  }

  if (isAuthenticated) {
    window.location.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-grid flex items-center justify-center p-4">
      <div className="pixel-card w-full max-w-md">
        {/* cara */}
        <div className="mb-6 flex justify-center">
          <ButterRobotFace />
        </div>

        {/* título */}
        <h1 className="retro-title text-center">BUTTERBOI • LOGIN</h1>

        {/* acciones */}
        <div className="mt-6 grid gap-3">
          <button
            className="retro-btn"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { prompt: "login" },
              })
            }
          >
            Ingresar con Google
          </button>

          <p className="text-center text-[11px] tracking-wide text-zinc-300">
            ¿No tenés cuenta?{" "}
            <button
              className="retro-link"
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { screen_hint: "signup" },
                })
              }
            >
              Registrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
