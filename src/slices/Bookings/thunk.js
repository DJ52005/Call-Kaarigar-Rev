// src/slices/Bookings/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBookings, cancelBookingApi } from "../../api/backend_helper";

// fetch bookings
export const fetchBookings = createAsyncThunk(
  "bookings/all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllBookings();
      return Array.isArray(res) ? res : res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
    const res = await getAllBookings();
console.log("fetchBookings raw response:", res);
return Array.isArray(res) ? res : res.data || [];

  }
);

// cancel booking
export const cancelBookingThunk = createAsyncThunk(
  "bookings/cancelBooking",
  async ({ bookingId, workerServiceId }, { rejectWithValue }) => {
    try {
      const res = await cancelBookingApi(bookingId, workerServiceId);
      return res; // could be bookingId or backend response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

