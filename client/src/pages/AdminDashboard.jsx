import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const deleteUser = id => {
    api.delete(`/admin/users/${id}`).then(() =>
      setUsers(users.filter(u => u.id !== id))
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl mb-4">Admin: User Management</h1>
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u.id} className="flex justify-between">
              <span>
                {u.first_name} {u.last_name} ({u.email}) — {u.role}
              </span>
              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
