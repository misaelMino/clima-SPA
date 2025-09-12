// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginApi, logoutApi, refreshApi } from "../api/auth";
import { bindAuth } from "../api/authBridge";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    // Cargar token desde localStorage al inicializar
    return localStorage.getItem('accessToken') || null;
  });
  const [user, setUser] = useState(() => {
    // Cargar usuario desde localStorage al inicializar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!accessToken;

  const login = useCallback(async ({ username, password }) => {
    const data = await loginApi({ username, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    
    // Guardar en localStorage
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setAccessToken(null);
      setUser(null);
      
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, []);

  // Persistencia: intentar refresh al montar si hay token guardado
  useEffect(() => {
    if (accessToken) {
      (async () => {
        try {
          const data = await refreshApi();
          setAccessToken(data.accessToken);
          localStorage.setItem('accessToken', data.accessToken);
          // si querés, pedir /me para setear user
        } catch { 
          // Si el refresh falla, limpiar la sesión
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      })();
    }
  }, [accessToken]);

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
