// client/src/components/navbar.jsx
import React from 'react';
import { Loader2, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border bg-white shadow-sm sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo + Name */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')} // Go to landing page
        >
          <img
            src="/images/logo-outline.png"
            alt="TaskFlow Logo"
            className="h-8 w-auto"
          />
          <span className="text-sm font-bold text-primary">TaskFlow</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-6 text-primary">
          <Link to="/home" className="text-sm font-medium hover:text-primary/80">
            Home
          </Link>
          <Link to="/features" className="text-sm font-medium hover:text-primary/80">
            Features
          </Link>
          <Link to="/team" className="text-sm font-medium hover:text-primary/80">
            Team
          </Link>

          {isAuthenticated && (
            <Link to="/notifications" className="relative">
              <Bell className="h-5 w-5 hover:text-primary" />
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                3
              </span>
            </Link>
          )}

          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
