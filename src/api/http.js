import axios from "axios";
import { getAuth } from "./authBridge"; 

const base = (import.meta.env.VITE_API_CLIMA || "").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: "/api/v1",        
  withCredentials: true,     
});



// ---- Interceptors ----
// (1) Request: agrega Authorization si hay accessToken
api.interceptors.request.use((config) => {
  const { accessToken } = getAuth();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// (2) Response: si 401 (expirado), intenta refresh y reintenta
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (!refreshing) {
      refreshing = api.post("/auth/refresh", {}, { withCredentials: true })
        .then((r) => {
          const { setAccessToken } = getAuth();
          setAccessToken(r.data.accessToken);
          return r.data.accessToken;
        })
        .finally(() => { refreshing = null; });
    }

    const newAccess = await refreshing;
    original._retry = true;
    original.headers.Authorization = `Bearer ${newAccess}`;
    return api(original);
  }
);
