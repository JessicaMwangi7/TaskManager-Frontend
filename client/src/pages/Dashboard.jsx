import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // ✅ axios instance

function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome{user?.username ? `, ${user.username}` : ""}!
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <Button
          onClick={() => navigate("/create-project")}
          className="bg-primary text-white hover:bg-primary/90"
        >
          + Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600">
          No projects yet. Start by creating one.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-primary">{project.name}</h3>
              <p className="text-sm text-gray-600">
                {project.description || "No description provided"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                View Project
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
