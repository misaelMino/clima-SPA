import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaUser,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { registerApi } from "../../api/auth";

import logo from "../../assets/logo1.png";
import SnowV3 from "../../components/SnowV3";
import AnimatedGradient from "../../components/AnimatedGradient";

import "./RegisterPage.css";   // estilos de esta pantalla
import "../login/LoginPage.css"; // reutilizamos estilos del login (dofon, inputs, etc.)

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // refs para animaciones (mismo patrón que en Login)
  const cardRef = useRef(null);
  const inputsRef = useRef([]);
  const btnRef = useRef(null);

  const StaticSnow = useMemo(
    () => (
      <SnowV3
        className="absolute inset-0 z-[1]"
        density={70}
        speed={1.1}
        color="#fff"
      />
    ),
    []
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "back",
        immediateRender: false,
        onComplete: () => gsap.set(cardRef.current, { clearProps: "transform" }),
      });
      gsap.from(inputsRef.current, {
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        immediateRender: false,
      });
      if (btnRef.current) {
        gsap.from(btnRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.5,
          delay: 1,
          ease: "elastic.out(1, 0.5)",
          immediateRender: false,
          onComplete: () => gsap.set(btnRef.current, { clearProps: "transform" }),
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const isValid =
    form.username.trim().length >= 3 &&
    form.password.length >= 4 &&
    form.password === form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isValid) {
      setErrorMsg("Revisá los campos: usuario (≥3), contraseña (≥4) y que coincidan.");
      return;
    }

    try {
      setSubmitting(true);
      // 1) Registro
      await registerApi({ username: form.username.trim(), password: form.password });

      // 2) Modal de éxito
      setSuccessOpen(true);
    } catch (err) {
      const apiErr =
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo registrar. Intentá nuevamente.";
      setErrorMsg(apiErr);
    } finally {
      setSubmitting(false);
    }
  };

  // Al confirmar el modal: login automático y a Home
  const handleSuccessOk = async () => {
    try {
      await login({ username: form.username, password: form.password });
      navigate("/", { replace: true });
    } catch {
      // Si algo falla acá, te dejo un fallback simple
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-2 relative">
        <div
          ref={cardRef}
          className="dofon login-container z-[50] rounded-3xl p-8 shadow-2xl w-full max-w-md transform transition-transform duration-300"
        >
          <div className="logo-container">
            <img src={logo} alt="logo" />
          </div>

          <h2 className="login-title text-4xl font-extrabold mb-6 text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div className="relative" ref={(el) => (inputsRef.current[0] = el)}>
              <FaUser className="absolute left-3 top-3 text-white z-10" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                required
                minLength={3}
                className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none"
                placeholder="Usuario"
                autoComplete="username"
              />
            </div>

            {/* Contraseña */}
            <div className="relative" ref={(el) => (inputsRef.current[1] = el)}>
              <FaLock className="absolute left-3 top-3 text-white z-10" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                required
                minLength={4}
                className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none"
                placeholder="Contraseña"
                autoComplete="new-password"
              />
            </div>

            {/* Repetir contraseña */}
            <div className="relative" ref={(el) => (inputsRef.current[2] = el)}>
              <FaLock className="absolute left-3 top-3 text-white z-10" />
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm((s) => ({ ...s, confirm: e.target.value }))}
                required
                minLength={4}
                className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none"
                placeholder="Repetir contraseña"
                autoComplete="new-password"
              />
            </div>

            {/* Error inline */}
            {errorMsg && (
              <p className="text-red-400 text-sm text-center -mt-2">{errorMsg}</p>
            )}

            <button
              ref={btnRef}
              type="submit"
              disabled={submitting}
              className="login-button w-full text-white font-bold py-3 px-4 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>

          <p className="text-white text-center mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="register-link font-bold">
              Iniciar sesión
            </Link>
          </p>
        </div>

        {StaticSnow}
        <AnimatedGradient />
      </div>

      {/* Modal de éxito */}
      {successOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.65)] backdrop-blur">
          <div className="success-modal">
            <div className="success-modal-header">
              <FaCheckCircle className="success-icon" />
              <h3 className="success-title">¡Cuenta creada!</h3>
            </div>
            <div className="success-body">
              <p>Tu cuenta se creó correctamente! :D</p>
              <p>Iniciaremos sesión ahora mismo!</p>
            </div>
            <div className="success-actions">
              <button onClick={handleSuccessOk} className="success-ok">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
