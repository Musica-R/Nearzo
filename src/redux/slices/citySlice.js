import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCities } from "../../api/cityApi";

export const getCities = createAsyncThunk(
  "city/getCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCities();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load cities");
    }
  }
);

const citySlice = createSlice({
  name: "city",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default citySlice.reducer;
