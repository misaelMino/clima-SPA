import axios from "axios";

// Podés setearlo con VITE_API_BASE, igual que antes
const BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

// 👉 mutable: el AuthContext nos va a pasar esta función
let tokenProvider = null;
export function setTokenProvider(fn) {
  tokenProvider = fn; // fn: async () => string|null
}

// Interceptor: agrega Bearer de Auth0 si existe
api.interceptors.request.use(async (config) => {
  if (tokenProvider) {
    try {
      const token = await tokenProvider();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // si falla el token, seguimos sin header y que el backend decida
      // (o podés redirigir a login si querés)
    }
  }
  return config;
});
