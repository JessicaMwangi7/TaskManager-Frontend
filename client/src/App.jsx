import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar          from "./components/navbar";
import LandingPage     from "./pages/LandingPage";
import Onboarding      from "./pages/Onboarding";
import Home            from "./pages/Home";
import Features        from "./pages/Features";
import Team            from "./pages/Team";
import Login           from "./pages/Login";
import Signup          from "./pages/Signup";
import Dashboard       from "./pages/Dashboard";
import Projects        from "./pages/projects";
import ProjectDetail   from "./pages/ProjectDetail";
import CreateProject   from "./pages/CreateProject";
import CreateTask      from "./pages/CreateTask";
import ChatRoom        from "./pages/ChatRoom";
import Notifications   from "./pages/Notifications";
import TaskComments    from "./components/Task/TaskComments";
import AdminDashboard  from "./pages/AdminDashboard";

function App() {
  const { token, user } = useAuth();
  const ProtectedRoute = ({ children }) =>
    token ? children : <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/signup"   element={<Signup />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Onboarding */}
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Main App */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <AdminDashboard /> : <Dashboard />}
            </ProtectedRoute>
          }
        />

        {/* Projects */}
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/add-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />

        {/* Tasks */}
        <Route
          path="/task/:id/comments"
          element={
            <ProtectedRoute>
              <TaskComments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:projectId"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
