import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerVendor } from "../../api/vendorApi";

export const submitVendorRegistration = createAsyncThunk(
  "vendor/register",
  async ({ type, formData }, { rejectWithValue }) => {
    try {
      const res = await registerVendor(type, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetVendorState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitVendorRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitVendorRegistration.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitVendorRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;