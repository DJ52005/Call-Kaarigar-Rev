// src/api/backend_helper.js
import * as url from "./url_helper";
import { ApiCore } from "./api_helper";
import axios from "axios";
import config from "../config/config.json";
import { createAsyncThunk } from "@reduxjs/toolkit";


const api = new ApiCore();
const API_URL = config.API_BASE_URL;

// ---------------- AUTH ----------------
export const login = async (data) => {
  try {
    const res = await api.post(url.REST_LOGIN, data);

    const token = res.data?.token || res.token || res.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
    }

    return res.data;
  } catch (error) {
    throw error;
  }
};

// ---------------- ADDRESSES ----------------
export const getAddresses = () => api.get(url.REST_ADDRESS);
export const getAddressById = (id) => api.get(`${url.REST_ADDRESS}/${id}`);
export const addAddress = (addressData) => api.post(url.REST_ADDRESS, addressData);
export const addService = (addressData) => api.post(url.REST_SERVICES, addressData);
export const updateAddress = (id, addressData) =>
  api.put(`${url.REST_ADDRESS}/${id}`, addressData);
export const deleteAddress = (id) => api.delete(`${url.REST_ADDRESS}/${id}`);

// ---------------- BOOKINGS ----------------
export const getAllBookings = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/api/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// backend_helper.js
export const cancelBookingApi = async (bookingId, workerServiceId) => {
  try {
    const token = localStorage.getItem("token");

    console.log("[cancelBookingApi] payload:", { bookingId, workerServiceId });

    // DELETE requests often don't handle body well → safer to send in URL if backend expects it
    const url = workerServiceId
      ? `${API_URL}/api/bookings/${bookingId}?workerServiceId=${workerServiceId}`
      : `${API_URL}/api/bookings/${bookingId}`;

    const { data } = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
      // only include data if needed and defined
      ...(workerServiceId ? { data: { workerServiceId } } : {}),
    });

    return data || bookingId; // return actual data if backend sends it, else bookingId
  } catch (error) {
    console.error("[cancelBookingApi] error:", error.response?.data || error.message);
    throw error;
  }
};


// ---------------- SERVICES ----------------
export const getServiceCategoriesApi = () => api.get(url.REST_CATEGORIES);
export const getServicesByCategoryApi = (categoryId) =>
  api.get(`${url.REST_SERVICES_CATEGORY}/${categoryId}`);
// ✅ Get all ACTIVE services
export const getActiveServicesApi = () =>
  api.get(`${BASE_URL}api/services/active`);
export const getProvidersByService = (workerId) => {
  return api.get(`${config.API_URL}/worker-services/worker/${workerId}`);
};
export const getAllWorkers = async () => {
  try {
    const res = await axios.get(`${config.API_URL}/api/worker-profile`);
    return res.data; // array of workers
  } catch (err) {
    console.error("Error fetching workers:", err);
    return [];
  }
};

// Fetch services for a specific worker
export const getProvidersByWorker = async (workerId) => {
  try {
    const res = await api.get(`${config.API_URL}/worker-services/worker/${workerId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching services for worker ${workerId}:`, err);
    return [];
  }
};

// Fetch providers for all workers
export const getAllProvidersWithServices = async () => {
  try {
    const workers = await getAllWorkers();
    const allProvidersPromises = workers.map(async (worker) => {
      const services = await getProvidersByWorker(worker._id);
      return { worker, services };
    });

    return await Promise.all(allProvidersPromises); // [{ worker, services }, ...]
  } catch (err) {
    console.error("Error fetching all providers with services:", err);
    return [];
  }
};
// ---------------- CATEGORIES ----------------

// Fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "services/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${config.API_URL}${REST_CATEGORIES}`);
      const payload = res?.data;

      if (Array.isArray(payload?.data)) {
        return payload.data.map((cat) => ({
          ...cat,
          serviceCount: cat.serviceCount ?? 0, // safe default
        }));
      }

      if (Array.isArray(payload)) {
        return payload.map((cat) => ({
          ...cat,
          serviceCount: cat.serviceCount ?? 0,
        }));
      }

      return [];
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Add category
export const addCategory = createAsyncThunk(
  "services/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `${config.API_URL}${REST_CATEGORIES}`,
        categoryData
      );
      if (Array.isArray(res?.data?.data)) {
        return res.data.data[res.data.data.length - 1];
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "services/updateCategory",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${config.API_URL}${REST_CATEGORIES}/${id}`,
        updates
      );
      if (Array.isArray(res?.data?.data)) {
        const updated = res.data.data.find((c) => c._id === id);
        return updated || res.data.data[res.data.data.length - 1];
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "services/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${config.API_URL}${REST_CATEGORIES}/${categoryId}`);
      return categoryId;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);


// ---------------- WORKER HELPERS ----------------
const getToken = () => {
  let token = null;
  if (window?.store) {
    const state = window.store.getState();
    token = state.auth?.token;
  }
  if (!token) {
    token = localStorage.getItem("token");
  }
  return token;
};

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add interceptor for Authorization
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ---------------- WORKERS ----------------


// ---------------- WORKER DOCUMENT VERIFY ----------------
// Worker APIs
// Worker APIs
export const getWorkerProfileApi = (workerId) =>
  API.get(`/worker-profile/${workerId}`);

export const getWorkerDocumentsApi = (workerId) =>
  API.get(`/worker-documents/${workerId}`);

export const getWorkerServicesApi = (workerId) =>
  API.get(`/worker-services/worker/${workerId}`);

export const verifyWorkerDocumentApi = async (docId, status) => {
  const res = await API.post(`/worker-documents/${docId}/verify`, { status });
  return res.data;
};

export const deleteWorkerProfileApi = async (workerId) => {
  const res = await API.delete(`/worker-profile/${workerId}`);
  return res.data;
};

export const updateWorkerProfileApi = async (workerId, data) => {
  const res = await API.put(`/worker-profile/${workerId}`, data);
  return res.data;
};

// ---------------- USERS ----------------
export const fetchAllUsers = async () => {
  const token = getToken();
  const { data } = await axios.get(`${API_URL}/api/users/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createUser = async (userData) => {
  const token = getToken();
  const { data } = await axios.post(`${API_URL}/api/users/register`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const editUser = async (id, userData) => {
  const token = getToken();
  const { data } = await axios.put(`${API_URL}/api/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteUser = async (id) => {
  const token = getToken();
  await axios.delete(`${API_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
};

export const toggleStatus = async (id) => {
  const token = getToken();
  const { data } = await axios.patch(
    `${API_URL}/api/users/${id}/toggle-status`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ---------------- CUSTOMERS ----------------
export const getAllCustomersApi = () => axios.get(`${API_URL}/users`);

export const registerCustomerApi = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const updateCustomerApi = (id, updates) =>
  axios.put(`${API_URL}/auth/${id}`, updates);

export const deleteCustomerApi = (id) =>
  axios.delete(`${API_URL}/users/${id}`);



// 1. Get all complaints

// Fetch all complaints
export const fetchAllComplaintsApi = () =>
  API.get("/support-tickets");

// Fetch complaint stats
export const fetchComplaintStatsApi = () =>
  API.get("/support-tickets/stats");

// Fetch complaint by ID
export const fetchComplaintByIdApi = (id) =>
  API.get(`/support-tickets/${id}`);

// Update complaint status
export const updateComplaintStatusApi = (id, status) =>
  API.patch(`/support-tickets/${id}/status`, { status });


// ---------------- REVIEWS & RATINGS ----------------

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ✅ Get reviews by worker ID
export const getReviewsByWorkerIdApi = async (workerId) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/reviews/worker/${workerId}`,
      authHeaders()
    );
    return data?.data || []; // safely return just the array of reviews
  } catch (err) {
    console.error("[getReviewsByWorkerIdApi] Error:", err);
    throw err.response?.data?.message || err.message;
  }
};

// ✅ Get reviews by customer ID
export const getReviewsByCustomerIdApi = async (customerId) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/reviews/customer/${customerId}`,
      authHeaders()
    );
    return data?.data || [];
  } catch (err) {
    console.error("[getReviewsByCustomerIdApi] Error:", err);
    throw err.response?.data?.message || err.message;
  }
};

// ✅ Add a review
export const addReviewApi = async (reviewData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/reviews`,
      reviewData,
      authHeaders()
    );
    return data;
  } catch (err) {
    console.error("[addReviewApi] Error:", err);
    throw err.response?.data?.message || err.message;
  }
};

// ✅ Update a review
export const updateReviewApi = async (reviewId, reviewData) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/api/reviews/${reviewId}`,
      reviewData,
      authHeaders()
    );
    return data;
  } catch (err) {
    console.error("[updateReviewApi] Error:", err);
    throw err.response?.data?.message || err.message;
  }
};

// ✅ Delete a review
export const deleteReviewApi = async (reviewId) => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/api/reviews/${reviewId}`,
      authHeaders()
    );
    return data;
  } catch (err) {
    console.error("[deleteReviewApi] Error:", err);
    throw err.response?.data?.message || err.message;
  }
};

//------------------Transactions------------------
export const getAllTransactions = async () => {
  try {
    const { data } = await api.get("/api/payments/all");
    return data; // expects an array of transactions
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error.response?.data || error;
  }
};

// // Add a new transaction
// export const addTransactionApi = async (payload) => {
//   try {
//     const { data } = await api.post("/api/transactions", payload);
//     return data; // new transaction object
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     throw error.response?.data || error;
//   }
// };