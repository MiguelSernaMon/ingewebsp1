import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrutalistCard, BrutalistInput, BrutalistButton, BrutalistAlert } from "../components/ui";
import { householdService } from "../services/household";

export default function HouseholdNewPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!nombre.trim() || nombre.trim().length < 3) {
      setError("El nombre del hogar debe tener al menos 3 caracteres");
      return;
    }
    setLoading(true);
    try {
      const data = await householdService.create(nombre.trim(), descripcion.trim());
      navigate(`/households/${data.hogarId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to="/dashboard"
        className="inline-block font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors mb-6"
      >
        &larr; Volver
      </Link>

      <BrutalistCard className="p-8">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
          Crear Hogar
        </h1>

        {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <BrutalistInput
            label="Nombre del Hogar"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            minLength={3}
            maxLength={150}
            placeholder="Ej: Casa Principal"
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
              placeholder="Ej: Hogar principal para tareas compartidas"
            />
          </div>

          <BrutalistButton type="submit" disabled={loading} className="w-full text-xl py-3">
            {loading ? "Creando..." : "Crear Hogar"}
          </BrutalistButton>
        </form>
      </BrutalistCard>
    </div>
  );
}
