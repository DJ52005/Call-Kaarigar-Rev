// src/slices/Bookings/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchBookings, cancelBookingThunk } from "./thunk";

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // cancel
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
