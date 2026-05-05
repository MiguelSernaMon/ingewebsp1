import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { householdService } from "../services/household";
import { BrutalistButton } from "../components/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const [invitationCount, setInvitationCount] = useState(0);

  useEffect(() => {
    householdService.getMyInvitations().then((i) => setInvitationCount(i.length)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-yellow-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-black bg-yellow-400 flex items-center justify-center text-3xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
            {user?.nombre?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Bienvenido, {user?.nombre}</h1>
            <p className="font-bold text-gray-700">{user?.email}</p>
          </div>
        </div>
      </div>

      {invitationCount > 0 && (
        <div className="bg-green-200 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xl font-black uppercase">
              Tienes {invitationCount} invitacion{invitationCount > 1 ? "es" : ""} pendiente{invitationCount > 1 ? "s" : ""}
            </p>
            <Link to="/households">
              <BrutalistButton variant="primary" className="text-lg py-2 px-4">
                Ver
              </BrutalistButton>
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          to="/households"
          className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
        >
          <h2 className="text-2xl font-black uppercase mb-2 group-hover:underline decoration-4 decoration-black">
            Mis Hogares
          </h2>
          <p className="font-bold text-gray-600">
            Gestiona tus hogares, miembros e invitaciones.
          </p>
        </Link>

        <Link
          to="/households/new"
          className="bg-[#A3E635] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
        >
          <h2 className="text-2xl font-black uppercase mb-2 group-hover:underline decoration-4 decoration-black">
            Crear Hogar
          </h2>
          <p className="font-bold text-gray-700">
            Crea un nuevo hogar y comienza a organizar tareas.
          </p>
        </Link>
      </div>
    </div>
  );
}
