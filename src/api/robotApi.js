// src/api/robotApi.js
import { api } from "../api/httpAuth0";

// Ajustá las rutas reales de tu backend (protected por Auth0)
export async function getRobotTransactions({ email }) {
  const { data } = await api.post("/transactions", { email });
  return data;
}

export async function getRobotBalance({ email }) {
  const { data } = await api.post("/balance", { email });
  return data;
}
