import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  FaSun, 
  FaCloud, 
  FaSignOutAlt
} from "react-icons/fa";
import logo from "../assets/logo.png";
import LogoutModal from "./LogoutModal";
import "./Navbar.css";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Datos simulados de clima actual
  const currentWeather = {
    condition: "Parcialmente nublado",
    icon: "partly-cloudy"
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      console.log('Iniciando proceso de logout...');
      await logout();
      console.log('Logout exitoso, navegando al login...');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };


  const getWeatherIcon = () => {
    switch (currentWeather.icon) {
      case "partly-cloudy":
        return <FaCloud className="w-5 h-5 text-orange-400" />;
      case "sunny":
        return <FaSun className="w-5 h-5 text-yellow-400" />;
      default:
        return <FaCloud className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1200] border-b border-white/10 backdrop-blur bg-[#0b1322]/80">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        
        {/* Sección Izquierda - Logo + Temperatura */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo más grande */}
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="天气在你手中" 
              className="w-16 h-16 object-contain"
            />
            <span className="text-white text-lg lg:text-2xl">天气在你手中</span>
          </div>
          
        </div>

        {/* Sección Derecha - Botón de Cerrar Sesión */}
        <div className="flex items-center justify-end">
          <button 
            onClick={handleLogoutClick}
            className="p-3 text-white hover:text-red-400 transition-colors duration-200 flex items-center justify-center"
            title="Cerrar Sesión"
          >
            <FaSignOutAlt className="w-4 h-4 lg:w-5 lg:h-5 logout-icon" />
          </button>
        </div>
      </div>
      
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </nav>
  );
}