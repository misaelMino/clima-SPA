// ButterRobotFacePixelRound.tsx
import React from "react";
import "./ButterRobotFace.css";

export default function ButterRobotFace() {
  return (
    <div
      className="bbp-wrap"
      role="img"
      aria-label="ButterBoi pixel camera (round lens)"
    >
      <div className="bbp-led" />
      <div className="bbp-cable bbp-cable--left" />
      <svg
        className="bbp-svg"
        viewBox="0 0 40 40"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Patrón de dithering 2x2 */}
          <pattern
            id="dither2"
            width="2"
            height="2"
            patternUnits="userSpaceOnUse"
          >
            <rect width="2" height="2" fill="var(--sink-bg)" />
            <rect x="0" y="0" width="1" height="1" fill="#aeb6bc" />
            <rect x="1" y="1" width="1" height="1" fill="#aeb6bc" />
          </pattern>

          {/* Estrellita de brillo para highlights */}
          <g id="spark">
            <rect x="-0.5" y="-2" width="1" height="4" fill="#ffffff" />
            <rect x="-2" y="-0.5" width="4" height="1" fill="#ffffff" />
          </g>
        </defs>

        {/* Outline doble tipo sprite */}
        <rect
          x="0"
          y="2"
          width="40"
          height="36"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
        <rect
          x="1"
          y="3"
          width="38"
          height="34"
          fill="none"
          stroke="#2b2f33"
          strokeWidth="1"
        />

        {/* Carcasa */}
        <rect x="1" y="3" width="38" height="34" fill="var(--metal-mid)" />
        <rect x="1" y="3" width="38" height="2" fill="var(--metal-light)" />
        <rect x="1" y="35" width="38" height="2" fill="var(--metal-dark)" />

        {/* Tornillos (pixeles) */}
        <rect x="3" y="5" width="1" height="1" fill="#0b0f12" />
        <rect x="36" y="5" width="1" height="1" fill="#0b0f12" />
        <rect x="3" y="35" width="1" height="1" fill="#0b0f12" />
        <rect x="36" y="35" width="1" height="1" fill="#0b0f12" />

        {/* Panel interno con dithering */}
        <rect x="5" y="8" width="30" height="24" fill="url(#dither2)" />

        {/* Bezel: aberración cromática leve */}
        <g opacity=".25" transform="translate(0.5,-0.5)">
          <circle cx="20" cy="20" r="14" fill="#ff3b3b" />
        </g>
        <g opacity=".25" transform="translate(-0.5,0.5)">
          <circle cx="20" cy="20" r="14" fill="#00ffff" />
        </g>

        {/* Bezel real */}
        <circle cx="20" cy="20" r="14" fill="var(--ring-outer)" />
        <circle cx="20" cy="20" r="13" fill="#101c24" />
        <circle cx="20" cy="20" r="12" fill="var(--ring-inner)" />

        {/* Ojo con blink+pulse “choppy” */}
        <g className="bbp-eye-blink">
          <g className="bbp-eye-pulse">
            <circle cx="20" cy="20" r="12" fill="var(--glass-deep)" />
            <circle cx="20" cy="20" r="11" fill="#16313b" />
            <circle cx="20" cy="20" r="10" fill="var(--glass-mid)" />
            <circle cx="20" cy="20" r="9" fill="var(--glass-cyan)" />
            {/* Highlights existentes */}
            <circle cx="18.8" cy="17.8" r="0.8" fill="#ffffff" />
            <circle cx="19.8" cy="17.4" r="0.5" fill="#e7ffff" />
            {/* Sparkle tipo pixel-star */}
            <g transform="translate(25,15) scale(0.8)">
              <use href="#spark" />
            </g>
          </g>
        </g>
      </svg>
      <div className="bbp-shadow-steps" /> {/* sombra escalonada */}
      <div className="bbp-crt" />{" "}
      {/* scanlines opcional (activa con .is-crt en bbp-wrap) */}
    </div>
  );
}
