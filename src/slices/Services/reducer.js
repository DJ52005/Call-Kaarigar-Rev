import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllServices,
  fetchAllCategories,
  addCategory,
  addService,
  deleteCategory,
  deleteService,
  updateCategory,
  updateService,
} from "./thunk";

const initialState = {
  categories: [],
  services: [],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------------- CATEGORIES ----------------
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload) state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
        state.services = state.services.filter(
          (s) =>
            (s.service_categoryId?._id || s.service_categoryId) !== action.payload
        );
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.categories = state.categories.map((c) =>
            c._id === action.payload._id ? action.payload : c
          );
        }
      })

      // ---------------- SERVICES ----------------
      .addCase(fetchAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.services = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addService.fulfilled, (state, action) => {
        if (action.payload) state.services.push(action.payload);
      })
            .addCase(updateService.fulfilled, (state, action) => {
        if (action.payload) {
          state.services = state.services.map((s) =>
            s._id === action.payload._id ? action.payload : s
          );
        }
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload);
      });
  },
});

export default servicesSlice.reducer;
