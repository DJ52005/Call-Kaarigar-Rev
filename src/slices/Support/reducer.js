// src/slices/Support/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchComplaints,
  fetchStats,
  fetchComplaintById,
  toggleComplaintStatus,
} from "./thunk";

const initialState = {
  complaints: [],
  stats: { total: 0, pending: 0, resolved: 0 },
  selectedComplaint: null,
  loading: false,
  error: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComplaints
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchStats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // fetchComplaintById
      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedComplaint = action.payload;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // toggleComplaintStatus
      .addCase(toggleComplaintStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        // update in complaints list
        state.complaints = state.complaints.map((c) =>
          c.id === updated.id ? updated : c
        );
        // update if it's the currently selected one
        if (state.selectedComplaint && state.selectedComplaint.id === updated.id) {
          state.selectedComplaint = updated;
        }
      });
  },
});

export const { clearSelectedComplaint } = supportSlice.actions;
export default supportSlice.reducer;
