import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWorkersWithDetails,
  verifyWorkerDocument,
  deleteWorkerProfile,
  updateWorkerProfile,
} from "./thunk";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch workers
    builder
      .addCase(fetchWorkersWithDetails.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchWorkersWithDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null; // Reset error after successful fetch
      })
      .addCase(fetchWorkersWithDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // Verify document (no big change in list, handled locally)
    builder
      .addCase(verifyWorkerDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyWorkerDocument.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });

    // Delete worker - remove from list
    builder
      .addCase(deleteWorkerProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteWorkerProfile.fulfilled, (state, action) => {
        // Ensure workers are correctly removed based on either "id" or "_id"
        state.list = state.list.filter(
          (worker) => (worker.id || worker._id) !== action.payload
        );
        state.error = null; // Reset error on successful delete
      })
      .addCase(deleteWorkerProfile.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });

    // Update worker - update in list
    builder
      .addCase(updateWorkerProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(updateWorkerProfile.fulfilled, (state, action) => {
        const updatedWorker = action.payload;
        const id = updatedWorker.id || updatedWorker._id;
        const idx = state.list.findIndex(
          (worker) => (worker.id || worker._id) === id
        );
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...updatedWorker };
        }
        state.error = null; // Reset error after successful update
      })
      .addCase(updateWorkerProfile.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default providerSlice.reducer;
