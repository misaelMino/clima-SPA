import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Cargando…</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
