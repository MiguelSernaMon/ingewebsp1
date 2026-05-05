const API_URL = import.meta.env.DEV
  ? "/api"
  : "https://caso13.onrender.com/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  if (res.status === 401) {
    let body = "";
    try { body = await res.text(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error("Credenciales incorrectas o sesión expirada");
  }

  if (res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error("No tienes permiso para realizar esta acción");
  }

  if (res.status === 204) return null;

  const text = await res.text();

  if (!res.ok) {
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message || json.error || text;
    } catch {}
    throw new Error(message || `Error ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}