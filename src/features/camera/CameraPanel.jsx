import PixelCard from "../../components/ui/PixelCard";

export default function CameraPanel() {
  // Podés setear VITE_CAM_URL o usar un placeholder
  const url = import.meta.env.VITE_CAM_URL || "/assets/cam_placeholder.jpg";
  return (
    <PixelCard>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-300">Cámara</div>
      </div>
      <div className="aspect-video w-full bg-black/50 rounded-xl overflow-hidden grid place-items-center">
        {/* Si tenés stream MJPEG/RTSP->HLS, reemplazá por <img> o <video> */}
        <img src={url} alt="camera" className="w-full h-full object-cover" />
      </div>
    </PixelCard>
  );
}
