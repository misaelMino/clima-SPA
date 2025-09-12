import { api } from "./http";

const get = async (url, params) => {
  const res = await api.get(url, { params });
  return res.data;
};

export const getCiudades    = () => get("/ciudades");
export const getDiaria      = ({ ciudad_id, from, to }) => get("/diaria", { ciudad_id, from, to });
export const getDespejados  = (q) => get("/diaria/despejados", q);
export const getNublados    = (q) => get("/diaria/nublados", q);
export const getLluviosos   = (q) => get("/diaria/lluviosos", q);
export const getNevados     = (q) => get("/diaria/nevados", q);
export const getVentosos    = (q) => get("/diaria/ventosos", q);
export const getTormenta    = (q) => get("/diaria/tormenta", q);
export const getActual      = ({ ciudad_id }) => get("/actual", { ciudad_id });

export const exportCsv = async ({ ciudad_id, from, to, filename = "clima.csv" }) => {
  const res = await api.get("/export/csv", {
    params: { ciudad_id, from, to },
    responseType: "blob",
  });
  
  // Generar nombre de archivo profesional
  const today = new Date();
  const isToday = from === to && from === today.toISOString().split('T')[0];
  
  let finalFilename = filename;
  if (isToday) {
    const timestamp = today.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     today.toTimeString().split(' ')[0].replace(/:/g, '-');
    finalFilename = `datos_climaticos_hoy_${timestamp}.csv`;
  } else {
    const fromDate = new Date(from).toLocaleDateString('es-AR').replace(/\//g, '-');
    const toDate = new Date(to).toLocaleDateString('es-AR').replace(/\//g, '-');
    finalFilename = `datos_climaticos_${fromDate}_a_${toDate}.csv`;
  }
  
  const blobUrl = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
};
