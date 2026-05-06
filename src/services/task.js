import {
  mockGetTasks,
  mockGetTask,
  mockCreateTask,
  mockUpdateTask,
  mockDeleteTask,
  mockUpdateTaskStatus,
} from "./mock";
import { apiFetch } from "./api";

const USE_MOCK = false;

export const taskService = USE_MOCK
  ? {
      getByHousehold: mockGetTasks,
      getById: mockGetTask,
      create: mockCreateTask,
      update: mockUpdateTask,
      delete: mockDeleteTask,
      updateStatus: mockUpdateTaskStatus,
    }
  : {
      async getByHousehold(hogarId, filters = {}) {
        const params = new URLSearchParams();
        if (filters.estado) params.set("estado", filters.estado);
        if (filters.categoria) params.set("categoria", filters.categoria);
        if (filters.asignadoA) params.set("asignadoA", filters.asignadoA);
        const qs = params.toString();
        return apiFetch(`/households/${hogarId}/tasks${qs ? `?${qs}` : ""}`);
      },
      async getById(tareaId) {
        return apiFetch(`/tasks/${tareaId}`);
      },
      async create(hogarId, data) {
        return apiFetch(`/households/${hogarId}/tasks`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      },
      async update(tareaId, data) {
        return apiFetch(`/tasks/${tareaId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      },
      async delete(tareaId) {
        return apiFetch(`/tasks/${tareaId}`, { method: "DELETE" });
      },
      async updateStatus(tareaId, estado) {
        return apiFetch(`/tasks/${tareaId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ estado }),
        });
      },
    };
