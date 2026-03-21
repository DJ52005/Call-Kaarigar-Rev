import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWorkerDocumentsApi,
  getWorkerServicesApi,
  deleteWorkerProfileApi,
  updateWorkerProfileApi,
  verifyWorkerDocumentApi,
} from "../../api/backend_helper";
import axios from "axios";
import { normalizeWorkerId } from "../../utils/normalizeWorkerId";

// Fetch all workers with documents and services
export const fetchWorkersWithDetails = createAsyncThunk(
  "provider/fetchAllWithDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://call-kaarigar-env.eba-yrrc4gbq.ap-south-1.elasticbeanstalk.com/api/worker-profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const workersArray = Array.isArray(res.data?.data) ? res.data.data : [];

      const normalizedWorkers = await Promise.all(
        workersArray.map(async (worker) => {
          const workerId = normalizeWorkerId(worker);

          // fetch documents
          let documents = [];
          try {
            const docsRes = await getWorkerDocumentsApi(workerId);
            documents = Array.isArray(docsRes.data) ? docsRes.data : [];
          } catch (err) {
            console.warn(`Documents fetch failed for ${workerId}`, err);
          }

          // fetch services
          let services = [];
          try {
            const servicesRes = await getWorkerServicesApi(workerId);
            services = Array.isArray(servicesRes.data) ? servicesRes.data : [];
          } catch (err) {
            console.warn(`Services fetch failed for ${workerId}`, err);
          }

          return { ...worker, id: workerId, documents, services };
        })
      );

      return normalizedWorkers;
    } catch (err) {
      console.error("❌ Error fetching workers:", err);
      return rejectWithValue(err.response?.data || "Error fetching workers");
    }
  }
);

// Delete worker
export const deleteWorkerProfile = createAsyncThunk(
  "provider/deleteProfile",
  async (workerId, { rejectWithValue }) => {
    try {
      await deleteWorkerProfileApi(workerId);
      return workerId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting worker");
    }
  }
);

// Update worker
export const updateWorkerProfile = createAsyncThunk(
  "provider/updateProfile",
  async ({ workerId, data }, { rejectWithValue }) => {
    try {
      const res = await updateWorkerProfileApi(workerId, data);
      return { ...res, id: workerId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating worker");
    }
  }
);

// Verify worker document
export const verifyWorkerDocument = createAsyncThunk(
  "provider/verifyDocument",
  async ({ docId, status }, { rejectWithValue }) => {
    try {
      const res = await verifyWorkerDocumentApi(docId, status);
      return { docId, status, data: res };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error verifying document");
    }
  }
);
