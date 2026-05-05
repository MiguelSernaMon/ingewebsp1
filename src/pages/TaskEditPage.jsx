import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BrutalistCard, BrutalistAlert, LoadingSpinner } from "../components/ui";
import TaskForm from "../components/TaskForm";
import { taskService } from "../services/task";
import { householdService } from "../services/household";

export default function TaskEditPage() {
  const { tareaId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const id = Number(tareaId);

  useEffect(() => {
    taskService
      .getById(id)
      .then((t) => {
        setTask(t);
        return householdService.getMembers(t.hogarId);
      })
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      const updated = await taskService.update(id, data);
      navigate(`/households/${updated.hogarId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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

      <BrutalistCard className="p-8">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
          Editar Tarea
        </h1>

        {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

        <div className="mt-4">
          <TaskForm
            initialData={task}
            members={members}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </BrutalistCard>
    </div>
  );
}
