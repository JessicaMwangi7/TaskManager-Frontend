import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4 text-primary">
          Welcome to TaskFlow
        </h1>
        <p className="text-lg mb-6 text-primary">
          The Task Collaboration and Accountability App. Track your team’s tasks in one simple platform.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow"
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}
