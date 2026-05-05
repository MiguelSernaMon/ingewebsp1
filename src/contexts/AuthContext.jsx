import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);

    const handleExpired = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const userData = { nombre: data.nombre, email: data.email, token: data.token };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (nombre, email, password) => {
    const data = await authService.register(nombre, email, password);
    const userData = { nombre: data.nombre, email: data.email, token: data.token };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
