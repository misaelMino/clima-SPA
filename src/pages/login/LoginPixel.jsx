// ============================
// File: src/pages/LoginPixel.jsx
// Description: Login sin nieve, estilo pixel‑art/retro inspirado en ButterBoi
// Reemplaza tu Login.jsx por este (o crea una nueva ruta y usa este componente)
// Requiere Tailwind y (opcional) fuente "Press Start 2P" en index.html
// ============================
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo1.png";
import "./login-pixel.css";

export default function LoginPixel() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const userRef = useRef(null);

  const onChange = (field) => (e) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
    if (error) setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form); // misma API que ya usás
      navigate("/", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const apiMsg = err?.response?.data?.message || err?.response?.data?.error;
      const msg =
        status === 401 || status === 400
          ? "Credenciales incorrectas. Revisá usuario y contraseña."
          : apiMsg || "No pudimos iniciar sesión. Intentá de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-grid flex items-center justify-center p-4">
      {/* Contenedor principal con borde pixelado */}
      <div className="pixel-card w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="ButterBoi" className="h-14 drop-shadow-sm select-none" draggable={false} />
          <h1 className="retro-title text-center">BUTTERBOI • LOGIN</h1>
        </div>

        {/* "Lente" redondo dentro de carcasa cuadrada */}
        <div className="cam-shell mt-5">
          <div className="cam-lens">
            <div className="cam-glint" />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4" noValidate>
          <label className="retro-label" htmlFor="username">Usuario</label>
          <input
            ref={userRef}
            id="username"
            type="text"
            className="retro-input"
            placeholder="tu_usuario"
            autoComplete="username"
            value={form.username}
            onChange={onChange("username")}
            required
          />

          <label className="retro-label mt-2" htmlFor="password">Contraseña</label>
          <div className="relative">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              className="retro-input pr-24"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={onChange("password")}
              required
            />
            <button
              type="button"
              className="retro-ghost-btn absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>

          {error && (
            <div className="retro-error" role="alert" aria-live="polite">{error}</div>
          )}

          <button type="submit" disabled={loading} className="retro-btn mt-2">
            {loading ? "INGRESANDO…" : "INGRESAR"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] tracking-wide text-zinc-300">
          ¿No tenés cuenta? <a href="/register" className="retro-link">REGISTRATE</a>
        </p>
      </div>
    </div>
  );
}

