// /src/pages/Project.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { Button } from "@/components/ui/button";

function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load project.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success("Task deleted.");
      fetchProject();
    } catch (err) {
      toast.error("Failed to delete task.");
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchProject();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="p-6">
      {project ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-4">{project.description}</p>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            {/* ✅ NEW ADD TASK BUTTON */}
            <Button
              onClick={() => navigate(`/project/${project.id}/add-task`)}
              className="bg-primary text-white hover:bg-primary/90"
            >
              + Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <p>No tasks yet. Click + Add Task to create one.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="border rounded p-3 shadow flex justify-between items-center"
                >
                  <div>
                    <strong>{task.title}</strong>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <span
                      className={`text-xs font-medium ${
                        task.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(task.id, task.status)}
                    >
                      Toggle Status
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button
            variant="outline"
            className="mt-6"
            onClick={() => navigate("/projects")}
          >
            Back to Projects
          </Button>
        </>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
}

export default Project;
