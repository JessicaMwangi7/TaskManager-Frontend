// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "authToken";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Optional: decode token → get user info (you can install jwt-decode if needed)
      setIsAuthenticated(true);
      setUser({ token }); // replace with decoded user if decoding
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
    setUser({ token }); // replace with decoded user
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return { user, isAuthenticated, isLoading, login, logout };
};

export default useAuth;
