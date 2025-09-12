// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginApi, logoutApi, refreshApi } from "../api/auth";
import { bindAuth } from "../api/authBridge";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!accessToken;

  const login = useCallback(async ({ username, password }) => {
    const data = await loginApi({ username, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // Persistencia opcional: intentar refresh al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await refreshApi();
        setAccessToken(data.accessToken);
        // si querés, pedir /me para setear user
      } catch { /* sin sesión */ }
    })();
  }, []);

  // 🔗 Vincular el estado al bridge para que http.js pueda leer/actualizar
  useEffect(() => {
    bindAuth({ accessToken, setAccessToken });
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, user, isAuthenticated, login, logout, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
