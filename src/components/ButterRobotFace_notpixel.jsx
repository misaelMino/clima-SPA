import "./ButterRobotFace.css";

export default function ButterRobotFace() {
  return (
    <div className="bb-head" role="img" aria-label="ButterBoi camera module">
      {/* cables */}
      <div className="bb-cable bb-cable--left" />

      {/* LED */}
      <div className="bb-led" />

      {/* carcasa */}
      <div className="bb-shell">
        <div className="bb-sink">
          <div className="bb-bezel">
            <div className="bb-ring bb-ring--1" />
            <div className="bb-ring bb-ring--2" />
            <div className="bb-lens">
              <div className="bb-glass" />
              <div className="bb-glint" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
