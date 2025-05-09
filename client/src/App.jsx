import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Team from "./pages/Team";
import Chat from "./pages/Chat";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import Notifications from "./pages/Notifications";
import CreateProject from "./pages/CreateProject";
import CreateTask from "./pages/CreateTask"; // ✅ ADDED import
import TaskComments from "./pages/TaskComments";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();

  const ProtectedRoute = ({ children }) =>
    token ? children : <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/team" element={<Team />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><Project /></ProtectedRoute>} />
        <Route path="/project/:id/add-task" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} /> {/* ✅ NEW TASK ROUTE */}
        <Route path="/task/:id/comments" element={<ProtectedRoute><TaskComments /></ProtectedRoute>} />

        {/* ✅ AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
