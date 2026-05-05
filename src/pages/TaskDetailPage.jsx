import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BrutalistCard, BrutalistAlert, LoadingSpinner, BrutalistButton } from "../components/ui";
import TaskCard from "../components/TaskCard";
import { taskService } from "../services/task";

export default function TaskDetailPage() {
  const { tareaId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = Number(tareaId);

  const loadTask = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getById(id);
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleStatusChange = async (tareaId, estado) => {
    try {
      await taskService.updateStatus(tareaId, estado);
      loadTask();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to={`/households/${task?.hogarId}`}
        className="inline-block font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors mb-6"
      >
        &larr; Volver al hogar
      </Link>

      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

      {task && (
        <BrutalistCard className="p-6">
          <TaskCard
            task={task}
            onStatusChange={handleStatusChange}
            onEdit={(tareaId) => window.location.href = `/tasks/${tareaId}/edit`}
            onDelete={async (tareaId) => {
              if (!window.confirm("¿Eliminar esta tarea?")) return;
              try {
                await taskService.delete(tareaId);
                window.location.href = `/households/${task.hogarId}`;
              } catch (err) {
                setError(err.message);
              }
            }}
          />

          {task.descripcion && (
            <div className="mt-4 border-t-4 border-black pt-4">
              <h3 className="text-lg font-black uppercase mb-2">Descripción Completa</h3>
              <p className="font-bold text-gray-700">{task.descripcion}</p>
            </div>
          )}
        </BrutalistCard>
      )}
    </div>
  );
}
