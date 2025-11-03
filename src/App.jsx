import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import Home from "./pages/Home";
import PrivateRoute from "./routes/PrivateRoute";
import { initWS } from "./ws";

export default function App() {
  useEffect(() => {
    initWS();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}
