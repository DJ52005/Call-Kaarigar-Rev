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
          const workerId =
            typeof worker?._id === "object"
              ? worker._id._id
              : worker?._id;

          if (!workerId) {
            console.warn("❌ Missing workerId:", worker);
            return { ...worker, documents: [], services: [] };
          }

          // ================= FETCH DOCUMENTS =================
          let documents = [];

          try {
            const docsRes = await getWorkerDocumentsApi(workerId);
            const data = docsRes.data?.data || docsRes.data;

            console.log("📄 DOC API RESPONSE:", data);

            if (data && typeof data === "object") {
              documents = [
                data.aadhar && {
                  type: "aadhar",
                  url: data.aadhar.url,
                  fileType: data.aadhar.fileType,
                  status: data.status || "pending",
                  _id: data._id,
                },
                data.pan && {
                  type: "pan",
                  url: data.pan.url,
                  fileType: data.pan.fileType,
                  status: data.status || "pending",
                  _id: data._id,
                },
                data.policeVerification && {
                  type: "policeVerification",
                  url: data.policeVerification.url,
                  fileType: data.policeVerification.fileType,
                  status: data.status || "pending",
                  _id: data._id,
                },
                ...(Array.isArray(data.certifications)
                  ? data.certifications.map((c) => ({
                      type: "certification",
                      url: c.url,
                      fileType: c.fileType,
                      title: c.title,
                      verified: c.verified,
                      status: c.verified ? "accepted" : "pending",
                      _id: c._id,
                    }))
                  : []),
              ].filter(Boolean);
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
            _id: workerId,
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
      const res = await verifyWorkerDocumentApi(docId, status);

      return {
        docId,
        status,
        data: res.data || res,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Error verifying document"
      );
    }
  }
);