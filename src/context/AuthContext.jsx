// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginApi, logoutApi, refreshApi } from "../api/auth";
import { bindAuth } from "../api/authBridge";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [bootstrapped, setBootstrapped] = useState(false);

  const isAuthenticated = !!accessToken;

  const login = useCallback(async ({ username, password }) => {
    const data = await loginApi({ username, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }, []);

  const logout = useCallback(async () => {
    try { await logoutApi(); } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, []);

  // 🔁 Bootstrap de sesión: INTENTAR REFRESH SIEMPRE al montar (aunque no haya accessToken)
  useEffect(() => {
    (async () => {
      try {
        const data = await refreshApi();        // <-- solo requiere cookie rtk
        setAccessToken(data.accessToken);
        localStorage.setItem('accessToken', data.accessToken);
        // opcional: pedir /me y setUser(...)
      } catch {
        // sin cookie o expirada => seguimos anónimos
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  // 🔗 Bridge para que tu http.js pueda leer/actualizar el access token
  useEffect(() => {
    bindAuth({ accessToken, setAccessToken });
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, user, isAuthenticated, login, logout, setAccessToken, bootstrapped }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
