import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(nombre, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6">
      <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2">
          Registro
        </h1>

        {error && (
          <div className="bg-red-200 border-2 border-black p-3 mb-6 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-black mb-2 uppercase">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-black mb-2 uppercase">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-black mb-2 uppercase">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A3E635] text-black font-black text-2xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Unirse"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
          >
            ¿Ya tienes cuenta? Inicia Sesión.
          </Link>
        </div>
      </div>
    </div>
  );
}
