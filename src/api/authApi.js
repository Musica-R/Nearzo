import api from "./axios";

// Register a new user - expects FormData (supports profile_image file upload)
export const registerUser = (formData) =>
  api.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Login user with email + password
export const loginUser = (payload) => api.post("/login", payload);
