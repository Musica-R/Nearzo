import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://booking.mpdatahub.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Attach auth token from localStorage to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lokal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
