import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SnowV3 from "./SnowV3";
import AnimatedGradient from "./AnimatedGradient";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="pt-16 flex-1 relative">
        <Outlet />
      </main>
      <Footer />
      
      <SnowV3
        className="fixed inset-0 z-[1] pointer-events-none"
        density={20}
        speed={0.3}
        color="#fff"
      />
      <AnimatedGradient />
    </div>
  );
}
