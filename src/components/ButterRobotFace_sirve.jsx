// ButterRobotFacePixelRound.tsx
import React from "react";
import "./ButterRobotFace.css";

export default function ButterRobotFace() {
  return (
    <div className="bbp-wrap" role="img" aria-label="ButterBoi pixel camera (round lens)">
      <div className="bbp-led" />
      <div className="bbp-cable bbp-cable--left" />

      <svg
        className="bbp-svg"
        viewBox="0 0 40 40"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Carcasa */}
        <rect x="1" y="3" width="38" height="34" fill="var(--metal-mid)" />
        <rect x="0" y="2" width="40" height="36" fill="none" stroke="var(--metal-dark)" strokeWidth="2" />
        <rect x="1" y="3" width="38" height="2" fill="var(--metal-light)" />
        <rect x="1" y="35" width="38" height="2" fill="var(--metal-dark)" />

        {/* Panel interno */}
        <rect x="5" y="8" width="30" height="24" fill="var(--sink-bg)" />

        {/* Bezel */}
        <circle cx="20" cy="20" r="14" fill="var(--ring-outer)" />
        <circle cx="20" cy="20" r="13" fill="#101c24" />
        <circle cx="20" cy="20" r="12" fill="var(--ring-inner)" />

        {/* Lente redonda */}
        <circle cx="20" cy="20" r="12" fill="var(--glass-deep)" />
        <circle cx="20" cy="20" r="11" fill="#16313b" />
        <circle cx="20" cy="20" r="10" fill="var(--glass-mid)" />
        <circle cx="20" cy="20" r="9" fill="var(--glass-cyan)" />

        {/* Glint */}
        <circle cx="18.8" cy="17.8" r="0.8" fill="#ffffff" />
        <circle cx="19.8" cy="17.4" r="0.5" fill="#e7ffff" />
      </svg>
    </div>
  );
}
