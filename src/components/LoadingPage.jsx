import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SnowV3 from "./SnowV3";
import AnimatedGradient from "./AnimatedGradient";
import logo from "../assets/logo.png";
import "./LoadingPage.css";

export default function LoadingPage({ message = "Cargando..." }) {
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const dotsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del logo
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.5,
        rotation: 360,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
      });

      // Animación del texto
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });

      // Animación de los puntos
      gsap.to(dotsRef.current, {
        opacity: 0.3,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "power2.inOut",
      });

      // Animación de pulso para el contenedor
      gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="loading-container backdrop-blur-lg rounded-3xl p-12 shadow-2xl w-full max-w-md text-center">
        <div ref={logoRef} className="logo-container mb-8">
          <img src={logo} alt="logo" className="loading-logo" />
        </div>
        
        <div ref={textRef} className="loading-text mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
          <div className="flex justify-center space-x-1">
            <span ref={(el) => (dotsRef.current = [el])} className="loading-dot">.</span>
            <span ref={(el) => (dotsRef.current[1] = el)} className="loading-dot">.</span>
            <span ref={(el) => (dotsRef.current[2] = el)} className="loading-dot">.</span>
          </div>
        </div>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
      
      <SnowV3
        className="absolute inset-0 z-[1]"
        density={50}
        speed={0.8}
        color="#fff"
      />
      <AnimatedGradient />
    </div>
  );
}
