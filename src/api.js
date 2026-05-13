import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const signupAPI = (data) => api.post("/auth/signup", data);
export const loginAPI  = (data) => api.post("/auth/login", data);

// User APIs
export const updateDetailsAPI = (data) => api.put("/user/details", data);
export const getProfileAPI    = ()     => api.get("/user/profile");

export default api;
