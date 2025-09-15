// src/api/clima.js
import axios from "axios";

const { VITE_API_URL } = import.meta.env;

export const api = axios.create({
  baseURL: "/api/v1",     // << usa el proxy
  withCredentials: true,
});


// Helper para todas las GET con query params
const get = async (url, params) => {
  const res = await api.get(url, { params });
  return res.data;
};

// --------- Datos diarios (gráficos) ---------
export const getDiaria = ({ ciudad_id, from, to }) =>
  get("/diaria", { ciudad_id, from, to });

// --------- Filtros por condición ---------
export const getDespejados = ({ ciudad_id, from, to }) =>
  get("/diaria/despejados", { ciudad_id, from, to });

export const getNublados = ({ ciudad_id, from, to }) =>
  get("/diaria/nublados", { ciudad_id, from, to });

export const getLluviosos = ({ ciudad_id, from, to, min_mm = 1 }) =>
  get("/diaria/lluviosos", { ciudad_id, from, to, min_mm });

export const getNevados = ({ ciudad_id, from, to }) =>
  get("/diaria/nevados", { ciudad_id, from, to });

export const getVentosos = ({ ciudad_id, from, to, min_kmh = 40 }) =>
  get("/diaria/ventosos", { ciudad_id, from, to, min_kmh });

export const getTormenta = ({ ciudad_id, from, to }) =>
  get("/diaria/tormenta", { ciudad_id, from, to });

// --------- Estado actual ---------
export const getActual = ({ ciudad_id }) =>
  get("/actual", { ciudad_id });

// --------- Export CSV (descarga en browser) ---------
export const exportCsv = async ({ ciudad_id, from, to, filename = "clima.csv" }) => {
  const res = await api.get("/export/csv", {
    params: { ciudad_id, from, to },
    responseType: "blob", // <- clave para archivos
  });

  // Crear URL y disparar descarga
  const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};
