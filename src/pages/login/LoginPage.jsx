import { useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
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
  const { login } = useAuth();
  const navigate = useNavigate();

  // refs para animaciones
  const cardRef = useRef(null);
  const inputsRef = useRef([]);
  const btnRef = useRef(null);
  const socialsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "back",
        // evita pintar el estado inicial antes de arrancar
        immediateRender: false,
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/", { replace: true }); // va al home protegido
    } catch (err) {
      alert("Credenciales inválidas");
    }
  };

  return (
    <>
      {/* <div className="min-h-screen flex items-center justify-center p-2 relative bg-gradient-to-br from-[#030029] via-[#020018] to-[#030027]"> */}
      <div className="min-h-screen flex items-center justify-center p-2 relative">
        <div
          ref={cardRef}
          className="dofon z-[50] backdrop-blur-lg rounded-3xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-101"
        >
          <div className="logo-container">
            <img src="./src/assets/logo1.png" alt="logo" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center animate-pulse">
            Iniciar sesión
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative" ref={(el) => (inputsRef.current[0] = el)}>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 focus:bg-white/30 focus:ring-2 focus:ring-purple-300 text-white placeholder-gray-200 outline-none transition duration-200"
                placeholder="Usuario"
              />
              <FaUser className="absolute right-3 top-3 text-white" />
            </div>

            {/* Password */}
            <div className="relative" ref={(el) => (inputsRef.current[1] = el)}>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 focus:bg-white/30 focus:ring-2 focus:ring-purple-300 text-white placeholder-gray-200 outline-none transition duration-200"
                placeholder="Contraseña"
              />
              <FaLock className="absolute right-3 top-3 text-white" />
            </div>

            <button
              ref={btnRef}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#000000]/30 to-[#000129]/30 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:ring-4 focus:ring-purple-300 transition duration-300 transform hover:scale-105"
            >
              Entrar
              <FaArrowRight />
            </button>
          </form>

          <p className="text-white text-center mt-6">
            ¿No tenés cuenta?{" "}
            <a href="#" className="font-bold hover:underline">
              Registrate
            </a>
          </p>

          <div className="mt-8 flex justify-center space-x-6">
            <a
              href="#"
              className="text-white hover:text-purple-300 transition-colors duration-200"
              ref={(el) => (socialsRef.current[0] = el)}
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-white hover:text-purple-300 transition-colors duration-200"
              ref={(el) => (socialsRef.current[1] = el)}
            >
              <FaInstagram className="text-2xl" />
            </a>
          </div>
        </div>
        <SnowV3 className="absolute inset-0 z-[1]" density={70} speed={1.1} />
        <AnimatedGradient />
      </div>
    </>
  );
}
