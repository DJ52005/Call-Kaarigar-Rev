// src/service2/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllWorkerProfilesApi,
  verifyWorkerDocumentApi,
  deleteWorkerProfileApi,
  updateWorkerProfileApi,
} from "../../backend_helper";

// 🟠 Fetch all workers (already includes documents & services from unified API)
export const fetchWorkersWithDetails = createAsyncThunk(
  "provider/fetchWorkersWithDetails",
  async (_, { rejectWithValue }) => {
    try {
      const workers = await getAllWorkerProfilesApi(); // unified call
      console.log("Fetched from /api/worker-profile", workers);
      return workers;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch workers");
    }
  }
);

// ✅ Verify document
export const verifyWorkerDocument = createAsyncThunk(
  "provider/verifyWorkerDocument",
  async ({ docId, status }, { rejectWithValue }) => {
    try {
      await verifyWorkerDocumentApi(docId, status);
      return { docId, status };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to verify document");
    }
  }
);

// ✅ Delete worker
export const deleteWorkerProfile = createAsyncThunk(
  "provider/deleteWorkerProfile",
  async (workerId, { rejectWithValue }) => {
    try {
      await deleteWorkerProfileApi(workerId);
      return workerId;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete worker");
    }
  }
);

// ✅ Update worker
export const updateWorkerProfile = createAsyncThunk(
  "provider/updateWorkerProfile",
  async ({ workerId, data }, { rejectWithValue }) => {
    try {
      const updated = await updateWorkerProfileApi(workerId, data);
      return updated;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update worker");
    }
  }
);
