import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../services/auth";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6">
        <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
          <h1 className="text-3xl font-black uppercase mb-4">Token no proporcionado</h1>
          <p className="font-bold mb-4">
            El enlace de restablecimiento no es válido o está incompleto.
          </p>
          <Link
            to="/forgot-password"
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
          >
            Solicitar uno nuevo
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      setMessage(data.message || "Contraseña cambiada exitosamente.");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6">
      <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
          Nueva Contraseña
        </h1>

        {error && (
          <div className="bg-red-200 border-2 border-black p-3 mb-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-200 border-2 border-black p-3 mb-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {message}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xl font-black mb-2 uppercase">Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A3E635] text-black font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase disabled:opacity-50"
            >
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </form>
        )}

        <div className="mt-6">
          <Link
            to="/login"
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
