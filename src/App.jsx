import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JoinPage from "./pages/JoinPage";
import DashboardPage from "./pages/DashboardPage";
import HouseholdsPage from "./pages/HouseholdsPage";
import HouseholdNewPage from "./pages/HouseholdNewPage";
import HouseholdDetailPage from "./pages/HouseholdDetailPage";
import TaskNewPage from "./pages/TaskNewPage";
import TaskEditPage from "./pages/TaskEditPage";
import TaskDetailPage from "./pages/TaskDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/join" element={<JoinPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/households"
            element={
              <ProtectedRoute>
                <Layout>
                  <HouseholdsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/households/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <HouseholdNewPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/households/:hogarId"
            element={
              <ProtectedRoute>
                <Layout>
                  <HouseholdDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/households/:hogarId/tasks/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskNewPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/:tareaId/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskEditPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/:tareaId"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
