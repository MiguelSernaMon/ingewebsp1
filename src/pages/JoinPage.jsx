import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { householdService } from "../services/household";

export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleRespond = async (accion) => {
    setError("");
    setLoading(true);
    try {
      const data = await householdService.respondInvitation(token, accion);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6">
        <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
          <h1 className="text-3xl font-black uppercase mb-4">Token no proporcionado</h1>
          <p className="font-bold mb-4">El enlace de invitación no es válido o está incompleto.</p>
          <Link
            to="/login"
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E0E7FF] flex items-center justify-center p-6">
        <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
          <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
            Invitación a Hogar
          </h1>
          <p className="font-bold mb-6">
            Debes iniciar sesión o registrarte para aceptar esta invitación.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/login?redirect=/join?token=${encodeURIComponent(token)}`}
              className="w-full bg-[#A3E635] text-black font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase text-center"
            >
              Iniciar Sesión
            </Link>
            <Link
              to={`/register?redirect=/join?token=${encodeURIComponent(token)}`}
              className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors text-center"
            >
              ¿No tienes cuenta? Regístrate.
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4E0] flex items-center justify-center p-6">
      <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
          Invitación a Hogar
        </h1>

        {error && (
          <div className="bg-red-200 border-2 border-black p-3 mb-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}
        {result && (
          <div className="bg-green-200 border-2 border-black p-3 mb-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {result.estado === "Aceptada"
              ? `Te has unido a ${result.nombreHogar || "el hogar"} exitosamente.`
              : "Has rechazado la invitación."}
          </div>
        )}

        {!result && (
          <div className="space-y-6">
            <p className="font-bold text-lg">
              Has sido invitado a unirte a un hogar. ¿Deseas aceptar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRespond("Aceptar")}
                disabled={loading}
                className="flex-1 bg-[#A3E635] text-black font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase disabled:opacity-50"
              >
                {loading ? "..." : "Aceptar"}
              </button>
              <button
                onClick={() => handleRespond("Rechazar")}
                disabled={loading}
                className="flex-1 bg-red-400 text-black font-black text-xl py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all uppercase disabled:opacity-50"
              >
                {loading ? "..." : "Rechazar"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/dashboard"
            className="font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
