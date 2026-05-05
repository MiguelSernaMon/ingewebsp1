import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BrutalistCard, BrutalistButton, BrutalistAlert, LoadingSpinner } from "../components/ui";
import { householdService } from "../services/household";

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [h, i] = await Promise.all([
        householdService.getMine(),
        householdService.getMyInvitations(),
      ]);
      setHouseholds(h);
      setInvitations(i);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRespond = async (token, accion) => {
    setError("");
    try {
      await householdService.respondInvitation(token, accion);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

      {invitations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase">Invitaciones Pendientes</h2>
          {invitations.map((inv) => (
            <div
              key={inv.invitacionId}
              className="bg-yellow-200 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-4 flex-wrap"
            >
              <div>
                <p className="text-lg font-black uppercase">{inv.nombreHogar}</p>
                <p className="text-sm font-bold text-gray-600">
                  Expira: {new Date(inv.fechaExpiracion).toLocaleDateString("es-CO")}
                </p>
              </div>
              <div className="flex gap-2">
                <BrutalistButton variant="small" onClick={() => handleRespond(inv.token, "Aceptar")}>
                  Aceptar
                </BrutalistButton>
                <BrutalistButton variant="danger" onClick={() => handleRespond(inv.token, "Rechazar")}>
                  Rechazar
                </BrutalistButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase">Mis Hogares</h1>
        <Link
          to="/households/new"
          className="bg-[#A3E635] text-black font-black text-lg py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase"
        >
          + Nuevo Hogar
        </Link>
      </div>

      {households.length === 0 ? (
        <div className="bg-white border-4 border-black p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-xl font-bold text-gray-500 mb-4">
            Aún no perteneces a ningún hogar.
          </p>
          <p className="font-bold">
            Crea uno nuevo o espera a que un administrador te invite.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {households.map((h) => (
            <Link
              key={h.hogarId}
              to={`/households/${h.hogarId}`}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              <h2 className="text-xl font-black uppercase mb-1">{h.nombre}</h2>
              {h.descripcion && (
                <p className="font-bold text-gray-600 text-sm mb-2">{h.descripcion}</p>
              )}
              <span className="text-xs font-black uppercase bg-yellow-300 border-2 border-black px-2 py-1">
                {h.rol}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
