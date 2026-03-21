// src/slices/Bookings/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBookings, cancelBookingApi } from "../../api/backend_helper";

// fetch bookings
export const fetchBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllBookings();
      return Array.isArray(res) ? res : res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
    console.log("fetchBookings raw response:", res);

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

