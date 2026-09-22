import api from "./axios";

// Register a new user - expects FormData (supports profile_image file upload)
export const registerUser = (formData) =>
  api.post("/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Login user with email + password
export const loginUser = (payload) => api.post("/login", payload);

// Verify the OTP sent to the user's email after registration.
// GET with email + otp as query params.
export const verifyOtpUser = ({ email, otp }) =>
  api.get("/verify-email-otp", { params: { email, otp } });

// Resend a fresh OTP to the given email.
// GET with email as a query param.
export const resendOtpUser = ({ email }) =>
  api.get("/resend-email-otp", { params: { email } });