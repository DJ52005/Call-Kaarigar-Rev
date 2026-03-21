// src/slices/Service/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceCategories } from "./thunk";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("🚀 fetchServiceCategories.pending");
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        console.log("✅ fetchServiceCategories.fulfilled, payload:", action.payload);
        state.categories = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        console.error("❌ fetchServiceCategories.rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
