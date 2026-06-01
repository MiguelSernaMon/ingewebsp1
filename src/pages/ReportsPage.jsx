import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BrutalistCard, BrutalistAlert, LoadingSpinner } from "../components/ui";
import { reportService } from "../services/report";

export default function ReportsPage() {
  const { hogarId } = useParams();
  const id = Number(hogarId);

  const [distribution, setDistribution] = useState(null);
  const [cumplimiento, setCumplimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("distribution");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      reportService.getDistribution(id),
      reportService.getCumplimiento(id),
    ])
      .then(([dist, cumpl]) => {
        setDistribution(dist);
        setCumplimiento(cumpl);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Link
        to={`/households/${id}`}
        className="inline-block font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
      >
        &larr; Volver al hogar
      </Link>

      <h1 className="text-4xl font-black uppercase">Reportes</h1>

      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "distribution", label: "Distribución" },
          { key: "cumplimiento", label: "Cumplimiento" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`font-bold text-lg uppercase px-4 py-2 border-4 border-black transition-all ${
              tab === t.key
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Distribution Report */}
      {tab === "distribution" && distribution && (
        <div className="space-y-4">
          <BrutalistCard className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">
              Distribución de Responsabilidades
            </h2>
            {distribution.miembros && distribution.miembros.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-black text-left">
                    <th className="py-3 px-4 font-black uppercase text-sm">Miembro</th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">Total</th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">
                      <span className="inline-block bg-yellow-200 border-2 border-black px-2 py-0.5">Pendientes</span>
                    </th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">
                      <span className="inline-block bg-blue-200 border-2 border-black px-2 py-0.5">En Progreso</span>
                    </th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">
                      <span className="inline-block bg-green-300 border-2 border-black px-2 py-0.5">Completadas</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {distribution.miembros.map((m, i) => (
                    <tr
                      key={m.usuarioId}
                      className={`border-b-2 border-black font-bold ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4 text-lg">{m.nombre}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{m.total}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{m.pendientes}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{m.enProgreso}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{m.completadas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xl font-bold text-gray-500 text-center py-8">
                No hay datos de distribución disponibles.
              </p>
            )}
          </BrutalistCard>

          {/* Visual bar chart */}
          {distribution.miembros && distribution.miembros.length > 0 && (
            <BrutalistCard className="p-6">
              <h3 className="text-xl font-black uppercase mb-4">Resumen Visual</h3>
              <div className="space-y-4">
                {distribution.miembros.map((m) => {
                  const maxTasks = Math.max(...distribution.miembros.map((x) => x.total), 1);
                  const pct = (m.total / maxTasks) * 100;
                  return (
                    <div key={m.usuarioId}>
                      <div className="flex justify-between text-sm font-bold mb-1">
                        <span>{m.nombre}</span>
                        <span>{m.total} tareas</span>
                      </div>
                      <div className="w-full h-8 bg-gray-100 border-2 border-black">
                        <div
                          className="h-full bg-[#A3E635] border-r-2 border-black"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </BrutalistCard>
          )}
        </div>
      )}

      {/* Cumplimiento Report */}
      {tab === "cumplimiento" && cumplimiento && (
        <div className="space-y-4">
          <BrutalistCard className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">
              Historial de Cumplimiento por Usuario
            </h2>
            {cumplimiento.usuarios && cumplimiento.usuarios.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-4 border-black text-left">
                    <th className="py-3 px-4 font-black uppercase text-sm">Usuario</th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">Asignadas</th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">Completadas</th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">
                      <span className="inline-block bg-green-300 border-2 border-black px-2 py-0.5">A Tiempo</span>
                    </th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">
                      <span className="inline-block bg-red-200 border-2 border-black px-2 py-0.5">Tarde</span>
                    </th>
                    <th className="py-3 px-4 font-black uppercase text-sm text-center">Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {cumplimiento.usuarios.map((u, i) => (
                    <tr
                      key={u.usuarioId}
                      className={`border-b-2 border-black font-bold ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4 text-lg">{u.nombre}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{u.totalAsignadas}</td>
                      <td className="py-3 px-4 text-center text-xl font-black">{u.completadas}</td>
                      <td className="py-3 px-4 text-center text-xl font-black text-green-600">{u.aTiempo}</td>
                      <td className="py-3 px-4 text-center text-xl font-black text-red-600">{u.tarde}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-lg font-black px-3 py-1 border-2 border-black ${
                            u.tasaCumplimiento >= 80
                              ? "bg-green-300"
                              : u.tasaCumplimiento >= 50
                              ? "bg-yellow-200"
                              : "bg-red-200"
                          }`}
                        >
                          {u.tasaCumplimiento}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xl font-bold text-gray-500 text-center py-8">
                No hay datos de cumplimiento disponibles.
              </p>
            )}
          </BrutalistCard>

          {/* Visual compliance bars */}
          {cumplimiento.usuarios && cumplimiento.usuarios.length > 0 && (
            <BrutalistCard className="p-6">
              <h3 className="text-xl font-black uppercase mb-4">Tasa de Cumplimiento</h3>
              <div className="space-y-4">
                {cumplimiento.usuarios.map((u) => (
                  <div key={u.usuarioId}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>{u.nombre}</span>
                      <span>{u.tasaCumplimiento}%</span>
                    </div>
                    <div className="w-full h-8 bg-gray-100 border-2 border-black">
                      <div
                        className={`h-full border-r-2 border-black transition-all ${
                          u.tasaCumplimiento >= 80
                            ? "bg-green-400"
                            : u.tasaCumplimiento >= 50
                            ? "bg-yellow-300"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${Math.min(u.tasaCumplimiento, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </BrutalistCard>
          )}
        </div>
      )}
    </div>
  );
}
