const API_URL = "https://caso13.onrender.com/api";

export const authService = {
  async register(nombre, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!res.ok) throw new Error("Error en el registro");
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Error en el login");
    return res.json();
  },

  async logout(token) {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
    });
    if (!res.ok) throw new Error("Error en el logout");
    return res.json();
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Error recuperando contraseña");
    return res.json();
  },

  async resetPassword(token, nuevaPassword) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuevaPassword }),
    });
    if (!res.ok) throw new Error("Error reseteando contraseña");
    return res.json();
  }
};
