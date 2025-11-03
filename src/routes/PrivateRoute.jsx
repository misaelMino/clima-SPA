import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: 24 }}>Cargando…</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
