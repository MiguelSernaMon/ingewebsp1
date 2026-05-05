import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BrutalistCard, BrutalistAlert, LoadingSpinner } from "../components/ui";
import TaskForm from "../components/TaskForm";
import { taskService } from "../services/task";
import { householdService } from "../services/household";

export default function TaskNewPage() {
  const { hogarId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const id = Number(hogarId);

  useEffect(() => {
    householdService
      .getMembers(id)
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    const created = await taskService.create(id, data);
    navigate(`/households/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to={`/households/${id}`}
        className="inline-block font-bold underline text-lg decoration-4 decoration-black hover:bg-black hover:text-white transition-colors mb-6"
      >
        &larr; Volver al hogar
      </Link>

      <BrutalistCard className="p-8">
        <h1 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">
          Nueva Tarea
        </h1>

        {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}

        <div className="mt-4">
          <TaskForm members={members} onSubmit={handleSubmit} />
        </div>
      </BrutalistCard>
    </div>
  );
}
