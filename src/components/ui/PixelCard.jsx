export default function PixelCard({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl p-3 text-zinc-100 shadow-xl border border-white/10 bg-[#0f1621] ${className}`}
    >
      {children}
    </div>
  );
}
