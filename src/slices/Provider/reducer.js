import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWorkersWithDetails,
  deleteWorkerProfile,
  updateWorkerProfile,
  verifyWorkerDocument,
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
    builder
      // FETCH WORKERS
      .addCase(fetchWorkersWithDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkersWithDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.map((worker) => ({
          ...worker,
          id: worker.id || worker._id,
          documents: worker.documents?.map((d) => ({ ...d, id: d.id || d._id })) || [],
        }));
      })
      .addCase(fetchWorkersWithDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workers";
      })

      // DELETE WORKER
      .addCase(deleteWorkerProfile.fulfilled, (state, action) => {
        state.list = state.list.filter((w) => w.id !== action.payload);
      })

      // UPDATE WORKER
      .addCase(updateWorkerProfile.fulfilled, (state, action) => {
        const index = state.list.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })

      // VERIFY WORKER DOCUMENT
      .addCase(verifyWorkerDocument.fulfilled, (state, action) => {
        const { docId, status } = action.payload;
        state.list = state.list.map((worker) => {
          if (worker.documents?.some((d) => d.id === docId)) {
            return { ...worker, documentStatus: status };
          }
          return worker;
        });
      });
  },
});

export default providerSlice.reducer;
