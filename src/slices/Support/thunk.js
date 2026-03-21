// src/slices/Support/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllComplaintsApi,
  fetchComplaintStatsApi,
  fetchComplaintByIdApi,
  updateComplaintStatusApi,
} from "../../api/backend_helper";

// helper to normalize id field
const norm = (obj) => ({ ...obj, id: obj.id || obj._id });

// GET /api/support-tickets
// fetchComplaints
export const fetchComplaints = createAsyncThunk(
  "support/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAllComplaintsApi();
      if (Array.isArray(res.data)) {
        return res.data.map(norm);
      }
      // if backend returned an object like { success, message }
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// fetchStats
export const fetchStats = createAsyncThunk(
  "support/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchComplaintStatsApi();
      if (
        res.data &&
        typeof res.data.total === "number" &&
        typeof res.data.pending === "number" &&
        typeof res.data.resolved === "number"
      ) {
        return res.data;
      }
      // fallback if backend gave { success, message }
      return { total: 0, pending: 0, resolved: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// GET /api/support-tickets/:id
export const fetchComplaintById = createAsyncThunk(
  "support/fetchComplaintById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetchComplaintByIdApi(id);
      return norm(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// PATCH /api/support-tickets/:id/status
export const toggleComplaintStatus = createAsyncThunk(
  "support/toggleComplaintStatus",
  async ({ id, currentStatus }, { rejectWithValue, dispatch }) => {
    try {
      const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
      const res = await updateComplaintStatusApi(id, newStatus);
      const updated = norm(res.data);

      // Refresh list & stats
      dispatch(fetchComplaints());
      dispatch(fetchStats());

      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
