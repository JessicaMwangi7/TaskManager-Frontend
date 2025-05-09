import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

function TaskComments() {
  const { id } = useParams(); // task id
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/comments`, { task_id: id, text });
      toast.success("Comment added");
      setText("");
      fetchComments();
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-3">Task Comments</h1>
      <ul className="space-y-2 mb-4">
        {comments.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <strong>{c.user_email}:</strong> {c.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddComment} className="space-y-2">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
        <Button type="submit" className="w-full bg-primary text-white">
          Add Comment
        </Button>
      </form>
    </div>
  );
}

export default TaskComments;
