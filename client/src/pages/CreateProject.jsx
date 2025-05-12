// client/src/pages/CreateProject.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function CreateProject() {
  const [name, setName]           = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust these keys to match what your API expects!
      await API.post(
        "/projects",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Project created!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create project:", err);
      if (err.response?.data) {
        console.error("Server response body:", err.response.data);
        // If the API returns an `errors` object, show each field’s message:
        if (err.response.data.errors) {
          for (const [field, msgs] of Object.entries(err.response.data.errors)) {
            toast.error(`${field}: ${msgs.join(", ")}`);
          }
        }
      }
      toast.error(err.response?.data?.error || "Failed to create project.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
