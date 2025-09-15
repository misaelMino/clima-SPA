import { useLayoutEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import logo from "../../assets/logo1.png";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaArrowRight,
  FaInstagram,
} from "react-icons/fa";
import "./LoginPage.css";
import SnowV3 from "../../components/SnowV3";
import AnimatedGradient from "../../components/AnimatedGradient";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  // refs para animaciones
  const cardRef = useRef(null);
  const inputsRef = useRef([]);
  const btnRef = useRef(null);
  const socialsRef = useRef([]);
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
        onComplete: () =>
          gsap.set(cardRef.current, { clearProps: "transform" }),
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
          onComplete: () =>
            gsap.set(btnRef.current, { clearProps: "transform" }),
        });
      }

      gsap.to(socialsRef.current, {
        y: -10,
        stagger: 0.1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });

    // Limpia correctamente al re-montar en StrictMode
    return () => ctx.revert();
  }, []);

  const onChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (error) setError(null); // limpia error al tipear
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err); 
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
    <div className="min-h-screen flex items-center justify-center p-2 relative">
      <div
        ref={cardRef}
        className="dofon login-container z-[50] rounded-3xl p-8 shadow-2xl w-full max-w-md transform transition-transform duration-300 hover:scale-101"
      >
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="login-title text-4xl font-extrabold mb-6 text-center">
          Iniciar sesión
        </h2>

        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Username */}
          <div className="relative" ref={(el) => (inputsRef.current[0] = el)}>
            <FaUser className="absolute left-3 top-3 text-white z-10" />
            <input
              type="text"
              id="username"
              value={form.username}
              onChange={onChange("username")}
              required
              className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none"
              placeholder="Usuario"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="relative" ref={(el) => (inputsRef.current[1] = el)}>
            <FaLock className="absolute left-3 top-3 text-white z-10" />
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={onChange("password")}
              required
              className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none"
              placeholder="Contraseña"
              autoComplete="current-password"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="form-error" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <button
            ref={btnRef}
            type="submit"
            disabled={loading}
            className="dsadsa login-button w-full text-white font-bold py-3 px-4 rounded-lg"
          >
            <span>{loading ? "Ingresando..." : "Ingresar"}</span>
          </button>
        </form>

        <p className="text-white text-center mt-6">
          ¿No tenés cuenta?{" "}
          <a href="/register" className="register-link font-bold">
            Registrate
          </a>
        </p>
      </div>
      {StaticSnow}
      <AnimatedGradient />
    </div>
  );
}
