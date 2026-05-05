import React from "react";

export default function MemberList({ members }) {
  if (!members || members.length === 0) {
    return <p className="font-bold text-gray-500">No hay miembros registrados.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {members.map((m) => (
        <div
          key={m.usuarioId}
          className="bg-white border-2 border-black p-3 flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="w-10 h-10 rounded-full border-2 border-black bg-yellow-400 flex items-center justify-center text-lg font-black shrink-0">
            {m.nombre[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{m.nombre}</p>
            <p className="text-xs text-gray-600 truncate">{m.email}</p>
            <span className="text-xs font-black uppercase bg-gray-100 border border-black px-1">
              {m.rol}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
