import axios from "axios";

// ✅ Axios instance → uses /api → Vite proxy forwards to backend
const API = axios.create({
  baseURL: "/api",  // 🔥 IMPORTANT → use relative /api because Vite proxy is handling it
});

// ✅ Automatically attach token from localStorage if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
