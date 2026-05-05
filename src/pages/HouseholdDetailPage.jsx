import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BrutalistCard, BrutalistButton, BrutalistAlert, LoadingSpinner } from "../components/ui";
import TaskCard from "../components/TaskCard";
import MemberList from "../components/MemberList";
import InviteForm from "../components/InviteForm";
import { taskService } from "../services/task";
import { householdService } from "../services/household";

export default function HouseholdDetailPage() {
  const { hogarId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const id = Number(hogarId);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [membersData, tasksData] = await Promise.all([
        householdService.getMembers(id),
        taskService.getByHousehold(id),
      ]);
      setMembers(membersData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (tareaId, estado) => {
    try {
      await taskService.updateStatus(tareaId, estado);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (tareaId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    try {
      await taskService.delete(tareaId);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.estado === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <Link
        to="/dashboard"
        className="inline-block font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors"
      >
        &larr; Volver
      </Link>

      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-4xl font-black uppercase">Tareas</h1>
            <Link
              to={`/households/${hogarId}/tasks/new`}
              className="bg-[#A3E635] text-black font-black text-lg py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase"
            >
              + Nueva Tarea
            </Link>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "Pendiente", "En_progreso", "Completada"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-bold text-sm uppercase px-3 py-1 border-2 border-black transition-all ${
                  filter === f
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                {f === "all" ? "Todas" : f.replace("_", " ")}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <BrutalistCard className="p-8 text-center">
              <p className="text-xl font-bold text-gray-500">No hay tareas {filter !== "all" ? `en estado "${filter.replace("_", " ")}"` : "aún"}. </p>
            </BrutalistCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.tareaId}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onEdit={(tareaId) => navigate(`/tasks/${tareaId}/edit`)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <BrutalistCard className="p-6">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">
              Miembros
            </h2>
            <MemberList members={members} />
          </BrutalistCard>

          <BrutalistCard className="p-6">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-black pb-2">
              Invitar
            </h2>
            <InviteForm hogarId={id} />
          </BrutalistCard>
        </div>
      </div>
    </div>
  );
}
