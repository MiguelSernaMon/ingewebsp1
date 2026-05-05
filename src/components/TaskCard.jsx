import React from "react";
import { BrutalistButton } from "./ui";

const ESTADO_LABELS = {
  Pendiente: "Pendiente",
  En_progreso: "En Progreso",
  Completada: "Completada",
};

const ESTADO_COLORS = {
  Pendiente: "bg-yellow-200",
  En_progreso: "bg-blue-200",
  Completada: "bg-green-300",
};

export default function TaskCard({ task, onStatusChange, onDelete, onEdit, showActions = true }) {
  const isOverdue =
    task.fechaLimite && new Date(task.fechaLimite) < new Date() && task.estado !== "Completada";

  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-black uppercase leading-tight">{task.titulo}</h3>
        <span
          className={`text-xs font-black uppercase px-3 py-1 border-2 border-black ${ESTADO_COLORS[task.estado] || "bg-gray-200"}`}
        >
          {ESTADO_LABELS[task.estado] || task.estado}
        </span>
      </div>

      {task.descripcion && (
        <p className="text-sm font-bold text-gray-700">{task.descripcion}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs font-bold">
        {task.categoria && (
          <span className="bg-gray-100 border-2 border-black px-2 py-1 uppercase">
            {task.categoria}
          </span>
        )}
        {task.fechaLimite && (
          <span
            className={`border-2 border-black px-2 py-1 uppercase ${isOverdue ? "bg-red-200" : "bg-gray-100"}`}
          >
            {new Date(task.fechaLimite).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {isOverdue && " VENCIDA"}
          </span>
        )}
        {task.asignadoANombre && (
          <span className="bg-gray-100 border-2 border-black px-2 py-1">
            {task.asignadoANombre}
          </span>
        )}
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-2 mt-1">
          {task.estado !== "Completada" && (
            <BrutalistButton
              variant="small"
              onClick={() => onStatusChange?.(task.tareaId, "En_progreso")}
            >
              {task.estado === "Pendiente" ? "Iniciar" : "Completar"}
            </BrutalistButton>
          )}
          {task.estado === "En_progreso" && (
            <BrutalistButton
              variant="small"
              onClick={() => onStatusChange?.(task.tareaId, "Completada")}
            >
              Completar
            </BrutalistButton>
          )}
          {task.estado === "Completada" && (
            <BrutalistButton
              variant="small"
              onClick={() => onStatusChange?.(task.tareaId, "Pendiente")}
            >
              Reabrir
            </BrutalistButton>
          )}
          <BrutalistButton variant="outline" onClick={() => onEdit?.(task.tareaId)}>
            Editar
          </BrutalistButton>
          <BrutalistButton variant="danger" onClick={() => onDelete?.(task.tareaId)}>
            Eliminar
          </BrutalistButton>
        </div>
      )}
    </div>
  );
}
