// src/slices/Login/reducer.js
import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    admin: null,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.admin = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.admin = null;
    },
    logout: (state) => {
      state.admin = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token"); // ✅ consistent key
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  loginSlice.actions;
export default loginSlice.reducer;
