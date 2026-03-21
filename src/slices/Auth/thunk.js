// src/slices/Auth/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../api/backend_helper";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await login(credentials);

      // token already stored in localStorage by backend_helper
      return res.user || res; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
