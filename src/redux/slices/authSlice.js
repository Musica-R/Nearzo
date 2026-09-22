import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, verifyOtpUser, resendOtpUser } from "../../api/authApi";

const storedUser = localStorage.getItem("lokal_user");
const storedToken = localStorage.getItem("lokal_token");

// Normalizes Laravel-style validation error responses:
// { success:false, message:"Validation Error.", errors:{ field:["msg"] } }
// Falls back gracefully if the API only sends a plain message string.
const parseError = (err, fallback) => {
  const data = err.response?.data;
  if (!data) return { message: fallback, errors: {} };
  return {
    message: data.message || fallback,
    errors: data.errors || {},
  };
};

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await registerUser(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(parseError(err, "Registration failed"));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await loginUser(payload);
      if (res.data?.token) {
        localStorage.setItem("lokal_token", res.data.token);
        localStorage.setItem("lokal_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(parseError(err, "Login failed"));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await verifyOtpUser({ email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(parseError(err, "OTP verification failed"));
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await resendOtpUser({ email });
      return res.data;
    } catch (err) {
      return rejectWithValue(parseError(err, "Could not resend OTP"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,       // general/top-level message string
    fieldErrors: {},   // { fieldName: ["message", ...] }
    otpVerified: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("lokal_token");
      localStorage.removeItem("lokal_user");
    },
    clearAuthError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.fieldErrors = action.payload?.errors || {};
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.fieldErrors = action.payload?.errors || {};
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.fieldErrors = action.payload?.errors || {};
        state.otpVerified = false;
      })
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.fieldErrors = action.payload?.errors || {};
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;