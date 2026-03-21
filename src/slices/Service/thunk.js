// src/slices/Service/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getServiceCategoriesApi } from "../../api/backend_helper";

export const fetchServiceCategories = createAsyncThunk(
  "service/fetchServiceCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getServiceCategoriesApi();
      console.log("🔥 Full API Response:", res);

      // If backend returns { success, data: [...] }
      if (res?.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }

      // If backend returns an array directly
      if (Array.isArray(res?.data)) {
        return res.data;
      }

      return [];
    } catch (error) {
      console.error("❌ API Error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);
