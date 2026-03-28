import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config/config.json";
import {
  getWorkerDocumentsApi,
  getWorkerServicesApi,
  deleteWorkerProfileApi,
  updateWorkerProfileApi,
  verifyWorkerDocumentApi,
} from "../../api/backend_helper";
import axios from "axios";

// ================= FETCH WORKERS WITH DETAILS =================
export const fetchWorkersWithDetails = createAsyncThunk(
  "provider/fetchAllWithDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${config.API_URL}/api/worker-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const workersArray = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const normalizedWorkers = await Promise.all(
        workersArray.map(async (worker) => {
          
          // ✅ HANDLE NESTED _id OBJECT
          const workerId =
            typeof worker?._id === "object"
              ? worker._id._id
              : worker?._id;

          if (!workerId) {
            console.warn("❌ Missing workerId:", worker);
            return { ...worker, documents: [], services: [] };
          }

          console.log("✅ workerId:", workerId);

          // ================= FETCH DOCUMENTS =================
          let documents = [];

try {
  const docsRes = await getWorkerDocumentsApi(workerId);

  console.log("📄 DOC API RESPONSE:", docsRes.data);

  if (Array.isArray(docsRes.data)) {
    documents = docsRes.data;
  } else if (Array.isArray(docsRes.data?.data)) {
    documents = docsRes.data.data;
  } 
  // 🔥 THIS IS THE MISSING CASE
  else if (docsRes.data && typeof docsRes.data === "object") {
    documents = [docsRes.data]; // ✅ wrap single object into array
  } else {
    documents = [];
  }

} catch (err) {
  console.warn(`❌ Documents fetch failed for ${workerId}`, err);
}

          // ================= FETCH SERVICES =================
          let services = [];

          try {
            const servicesRes = await getWorkerServicesApi(workerId);

            if (Array.isArray(servicesRes.data)) {
              services = servicesRes.data;
            } else if (Array.isArray(servicesRes.data?.data)) {
              services = servicesRes.data.data;
            } else {
              services = [];
            }

          } catch (err) {
            console.warn(`❌ Services fetch failed for ${workerId}`, err);
          }

          return {
            ...worker,
            _id: workerId, // ✅ ALWAYS STRING NOW
            documents,
            services,
          };
        })
      );

      return normalizedWorkers;

    } catch (err) {
      console.error("❌ Error fetching workers:", err);
      return rejectWithValue(
        err.response?.data || "Error fetching workers"
      );
    }
  }
);

// ================= DELETE WORKER =================
export const deleteWorkerProfile = createAsyncThunk(
  "provider/deleteProfile",
  async (workerId, { rejectWithValue }) => {
    try {
      await deleteWorkerProfileApi(workerId);
      return workerId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error deleting worker"
      );
    }
  }
);

// ================= UPDATE WORKER =================
export const updateWorkerProfile = createAsyncThunk(
  "provider/updateProfile",
  async ({ workerId, data }, { rejectWithValue }) => {
    try {
      const res = await updateWorkerProfileApi(workerId, data);
      return { ...res, id: workerId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error updating worker"
      );
    }
  }
);

// ================= VERIFY DOCUMENT =================
export const verifyWorkerDocument = createAsyncThunk(
  "provider/verifyDocument",
  async ({ docId, status }, { rejectWithValue }) => {
    try {
      console.log("🚀 VERIFY:", docId, status);

      const res = await verifyWorkerDocumentApi(docId, status);

      return {
        docId,
        status,
        data: res.data || res,
      };

    } catch (err) {
      console.error("❌ Verify failed:", err);
      return rejectWithValue(
        err.response?.data || "Error verifying document"
      );
    }
  }
);