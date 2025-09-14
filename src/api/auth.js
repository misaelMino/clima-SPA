import { api } from "./http";

export async function loginApi({ username, password }) {
  const { data } = await api.post("/auth/login", { username, password }, { withCredentials: true });
  return data; // { accessToken, user }
}

export async function registerApi({ username, password }) {
  const { data } = await api.post("/auth/register", { username, password }, { withCredentials: true });
  return data; // { accessToken, user }
}


export async function refreshApi() {
  const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });
  return data; // { accessToken }
}

export async function logoutApi() {
  await api.post("/auth/logout", {}, { withCredentials: true });
}