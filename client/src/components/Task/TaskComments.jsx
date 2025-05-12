import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");

  const fetchComments = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}/comments`);
      setComments(res.data.comments);
    } catch {
      toast.error("Failed to load comments.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    try {
      await API.post(`/tasks/${taskId}/comments`, { text });
      setText("");
      fetchComments();
    } catch {
      toast.error("Failed to post comment.");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="space-y-2 max-h-48 overflow-auto border p-2 rounded">
        {comments.map(c => (
          <div key={c.id} className="border-b pb-1">
            <p className="text-sm"><strong>{c.user_email}</strong>:</p>
            <p className="text-sm">{c.text}</p>
            <p className="text-xs text-gray-500">{new Date(c.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow border p-2 rounded"
          required
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Post
        </button>
      </form>
    </div>
  );
}
