import PixelCard from "../../components/ui/PixelCard";
import "./mood-face.css";

// Importa automáticamente todos los PNG de la carpeta
const faces = import.meta.glob("../../assets/faces/*.png", { eager: true });

// Mapea nombres sin extensión a su URL
const moodImages = Object.fromEntries(
  Object.entries(faces).map(([path, mod]) => {
    const key = path.split("/").pop().replace(".png", ""); // ej: "01_amigable"
    return [key, mod.default];
  })
);

export default function MoodFace({
  mood = "01_amigable", // valor por defecto
  size = 128,
}) {
  const imageSrc = moodImages[mood] ?? moodImages["11_dead"];

  return (
    <PixelCard className="grid place-items-center">
      <div className="cam-shell mb-2 py-2">
        <img
          src={imageSrc}
          alt={mood}
          width={size}
          height={size}
          className="pixelated"
        />
      </div>
      <div className="text-xs text-zinc-300">mood: {mood}</div>
    </PixelCard>
  );
}
