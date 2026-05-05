import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-yellow-300 border-b-4 border-black">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-black uppercase tracking-tight">
          TareasDomésticas
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="font-bold text-lg hover:underline decoration-2 decoration-black"
          >
            Inicio
          </Link>
          <Link
            to="/households"
            className="font-bold text-lg hover:underline decoration-2 decoration-black"
          >
            Hogares
          </Link>

          <div className="flex items-center gap-2 border-l-4 border-black pl-4">
            <div className="w-9 h-9 rounded-full border-2 border-black bg-yellow-400 flex items-center justify-center text-sm font-black">
              {user?.nombre?.[0]?.toUpperCase()}
            </div>
            <span className="font-bold text-sm hidden sm:inline">{user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-red-400 border-2 border-black px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
