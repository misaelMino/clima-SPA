import PixelCard from "../../components/ui/PixelCard";
import "./mood-face.css";

/**
 * Props:
 * - spriteSheet: string (ruta al PNG con grilla 4x4)
 * - mood: key ("happy", "neutral", "sad", "angry", ...)
 * - size: px (lado del cuadrado del frame visible)
 */
const MAP = {
  happy: 0,
  neutral: 1,
  sad: 2,
  angry: 3,
  annoyed: 4,
  worried: 5,
  surprise: 6,
  sweat: 7,
  tongue: 8,
  cry: 9,
  meh: 10,
  dead: 11,
  blank: 12, // ...ajustá según tu sprite
};

export default function MoodFace({
  spriteSheet = "/assets/faces.png",
  mood = "neutral",
  size = 128,
}) {
  const idx = MAP[mood] ?? 1;
  const cols = 4; // 4x4
  const x = (idx % cols) * -size;
  const y = Math.floor(idx / cols) * -size;

  return (
    <PixelCard className="grid place-items-center">
      <div className="cam-shell mb-2">
        <div
          className="cam-lens"
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${spriteSheet})`,
            backgroundPosition: `${x}px ${y}px`,
            backgroundSize: `${cols * size}px auto`,
          }}
        />
      </div>
      <div className="text-xs text-zinc-300">mood: {mood}</div>
    </PixelCard>
  );
}
