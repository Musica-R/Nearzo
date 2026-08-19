import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchActivityCategories } from "../../api/activityCategoryApi";

export const getActivityCategories = createAsyncThunk(
  "activityCategory/getByType",
  async (type, { rejectWithValue }) => {
    try {
      const res = await fetchActivityCategories(type);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load categories");
    }
  }
);

const activityCategorySlice = createSlice({
  name: "activityCategory",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearActivityCategories: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivityCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getActivityCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivityCategories } = activityCategorySlice.actions;
export default activityCategorySlice.reducer;