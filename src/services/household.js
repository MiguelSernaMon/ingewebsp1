import {
  mockCreateHousehold,
  mockInvite,
  mockRespondInvitation,
  mockGetMembers,
  mockGetMyHouseholds,
  mockGetMyInvitations,
} from "./mock";
import { apiFetch } from "./api";

const USE_MOCK = import.meta.env.PROD;

export const householdService = USE_MOCK
  ? {
      create: mockCreateHousehold,
      invite: mockInvite,
      respondInvitation: mockRespondInvitation,
      getMembers: mockGetMembers,
      getMine: mockGetMyHouseholds,
      getMyInvitations: mockGetMyInvitations,
    }
  : {
      async create(nombre, descripcion) {
        return apiFetch("/households", {
          method: "POST",
          body: JSON.stringify({ nombre, descripcion }),
        });
      },
      async invite(hogarId, emailInvitado) {
        return apiFetch(`/households/${hogarId}/invite`, {
          method: "POST",
          body: JSON.stringify({ emailInvitado }),
        });
      },
      async respondInvitation(token, accion) {
        return apiFetch(`/households/invitations/${token}/respond`, {
          method: "POST",
          body: JSON.stringify({ accion }),
        });
      },
      async getMembers(hogarId) {
        return apiFetch(`/households/${hogarId}/members`);
      },
      async getMine() {
        return apiFetch("/households");
      },
      async getMyInvitations() {
        return apiFetch("/households/invitations");
      },
    };
