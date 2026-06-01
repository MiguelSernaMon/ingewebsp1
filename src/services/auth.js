import {
  mockLogin,
  mockRegister,
  mockLogout,
  mockForgotPassword,
  mockResetPassword,
} from "./mock";
import { apiFetch } from "./api";

const USE_MOCK = import.meta.env.PROD;

export const authService = USE_MOCK
  ? {
      register: mockRegister,
      login: mockLogin,
      logout: mockLogout,
      forgotPassword: mockForgotPassword,
      resetPassword: mockResetPassword,
    }
  : {
      async register(nombre, email, password) {
        return apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({ nombre, email, password }),
        });
      },
      async login(email, password) {
        return apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      },
      async logout() {
        return apiFetch("/auth/logout", { method: "POST" });
      },
      async forgotPassword(email) {
        return apiFetch("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
      },
      async resetPassword(token, nuevaPassword) {
        return apiFetch("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ token, nuevaPassword }),
        });
      },
    };
