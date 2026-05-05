import React, { useState } from "react";
import { BrutalistInput, BrutalistButton, BrutalistAlert } from "./ui";
import { householdService } from "../services/household";

export default function InviteForm({ hogarId }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const data = await householdService.invite(hogarId, email.trim());
      setSuccess(`Invitación enviada a ${data.emailInvitado}. Expira: ${new Date(data.fechaExpiracion).toLocaleDateString("es-CO")}`);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <BrutalistAlert variant="error">{error}</BrutalistAlert>}
      {success && <BrutalistAlert variant="success">{success}</BrutalistAlert>}

      <div className="flex gap-2">
        <div className="flex-1">
          <BrutalistInput
            label="Invitar miembro"
            id="inviteEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>
        <BrutalistButton
          type="submit"
          disabled={loading}
          className="self-end py-3 px-6"
        >
          {loading ? "..." : "Invitar"}
        </BrutalistButton>
      </div>
    </form>
  );
}
