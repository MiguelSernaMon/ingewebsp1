import React, { useState, useEffect } from "react";
import { BrutalistInput, BrutalistButton, BrutalistAlert } from "./ui";

export default function TaskForm({ initialData, members, onSubmit, loading }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [asignadoAId, setAsignadoAId] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo || "");
      setDescripcion(initialData.descripcion || "");
      setCategoria(initialData.categoria || "");
      setFechaLimite(
        initialData.fechaLimite
          ? new Date(initialData.fechaLimite).toISOString().slice(0, 16)
          : ""
      );
      setAsignadoAId(initialData.asignadoA?.usuarioId || initialData.asignadoAId || "");
      setPrioridad(initialData.prioridad || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isEditing = !!initialData;

    if (!titulo.trim() || titulo.trim().length < 3) {
      setError("El título debe tener al menos 3 caracteres");
      return;
    }

    if (!isEditing && !categoria.trim()) {
      setError("La categoría es obligatoria");
      return;
    }

    const data = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      categoria: categoria.trim() || undefined,
      prioridad: prioridad || undefined,
      fechaLimite: fechaLimite ? new Date(fechaLimite).toISOString() : undefined,
      asignadoAId: asignadoAId ? Number(asignadoAId) : undefined,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

      <BrutalistInput
        label="Título"
        id="titulo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        minLength={3}
        maxLength={150}
        placeholder="Ej: Lavar los platos"
      />

      <div>
        <label htmlFor="descripcion" className="block text-lg font-black mb-1 uppercase">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100"
          rows={3}
          placeholder="Detalles de la tarea..."
        />
      </div>

      <BrutalistInput
        label="Categoría"
        id="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required={!initialData}
        minLength={1}
        placeholder="Ej: Cocina, Limpieza, Jardín"
      />

      <div>
        <label htmlFor="prioridad" className="block text-lg font-black mb-1 uppercase">
          Prioridad
        </label>
        <select
          id="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100 bg-white"
        >
          <option value="">Sin prioridad</option>
          <option value="Alta">🔴 Alta</option>
          <option value="Media">🟡 Media</option>
          <option value="Baja">🟢 Baja</option>
        </select>
      </div>

      <BrutalistInput
        label="Fecha Límite"
        id="fechaLimite"
        type="datetime-local"
        value={fechaLimite}
        onChange={(e) => setFechaLimite(e.target.value)}
      />

      {members && members.length > 0 && (
        <div>
          <label htmlFor="asignadoA" className="block text-lg font-black mb-1 uppercase">
            Asignar a
          </label>
          <select
            id="asignadoA"
            value={asignadoAId}
            onChange={(e) => setAsignadoAId(e.target.value)}
            className="w-full border-4 border-black p-3 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-gray-100 bg-white"
          >
            <option value="">Sin asignar</option>
            {members.map((m) => (
              <option key={m.usuarioId} value={m.usuarioId}>
                {m.nombre} ({m.rol})
              </option>
            ))}
          </select>
        </div>
      )}

      <BrutalistButton type="submit" disabled={loading} className="w-full text-xl py-3">
        {loading ? "Guardando..." : initialData ? "Actualizar Tarea" : "Crear Tarea"}
      </BrutalistButton>
    </form>
  );
}
