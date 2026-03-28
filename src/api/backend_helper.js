// src/api/backend_helper.js

import axios from "axios";
import config from "../config/config.json";

const API_URL = config.API_BASE_URL;

// =========================
// 🔐 TOKEN HELPER
// =========================
const getToken = () => {
  return localStorage.getItem("token");
};

// =========================
// 🚀 AXIOS INSTANCE (MAIN FIX)
// =========================
const API = axios.create({
  baseURL: `${API_URL}/api`,
});

// ✅ Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling
API.interceptors.response.use(
  (res) => res.data,
  (error) => {
    console.error("API ERROR:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =========================
// 🔐 AUTH
// =========================
export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  const token = res?.token || res?.accessToken;
  if (token) {
    localStorage.setItem("token", token);
  }

  return res;
};

// =========================
// 📍 ADDRESSES
// =========================
export const getAddresses = () => API.get("/address");
export const addAddress = (data) => API.post("/address", data);
export const updateAddress = (id, data) => API.put(`/address/${id}`, data);
export const deleteAddress = (id) => API.delete(`/address/${id}`);

// =========================
// 📦 BOOKINGS
// =========================
export const getAllBookings = () => API.get("/bookings/all");

export const cancelBookingApi = (bookingId) => {
  return API.delete(`/bookings/${bookingId}`);
};

// =========================
// 🛠 SERVICES
// =========================
export const getServiceCategoriesApi = () => API.get("/categories");

export const getServicesByCategoryApi = (categoryId) =>
  API.get(`/services/category/${categoryId}`);

export const getActiveServicesApi = () =>
  API.get("/services/active");

// =========================
// 👷 WORKERS (UNIFIED)
// =========================

// ✅ BEST (use this everywhere)
export const getAllWorkerProfilesApi = () =>
  API.get("/worker-profile");

// Optional granular APIs
export const getWorkerProfileApi = (id) =>
  API.get(`/worker-profile/${id}`);

export const getWorkerDocumentsApi = (workerId) =>
  API.get(`/worker-documents/worker/${workerId}`);

export const getWorkerServicesApi = (id) =>
  API.get(`/worker-services/worker/${id}`);

// =========================
// 📄 DOCUMENT ACTIONS
// =========================
export const verifyWorkerDocumentApi = (docId, status) =>
  API.patch(`/worker-documents/${docId}/verify`, { status });

// =========================
// ✏️ WORKER ACTIONS
// =========================
export const deleteWorkerProfileApi = (workerId) =>
  API.delete(`/worker-profile/${workerId}`);

export const updateWorkerProfileApi = (workerId, data) =>
  API.put(`/worker-profile/${workerId}`, data);

// =========================
// 👤 USERS
// =========================
export const fetchAllUsers = () => API.get("/users/all");

export const createUser = (data) =>
  API.post("/users/register", data);

export const editUser = (id, data) =>
  API.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);

export const toggleStatus = (id) =>
  API.patch(`/users/${id}/toggle-status`);

// =========================
// 🧾 COMPLAINTS
// =========================
export const fetchAllComplaintsApi = () =>
  API.get("/support-tickets");

export const fetchComplaintStatsApi = () =>
  API.get("/support-tickets/stats");

export const fetchComplaintByIdApi = (id) =>
  API.get(`/support-tickets/${id}`);

export const updateComplaintStatusApi = (id, status) =>
  API.patch(`/support-tickets/${id}/status`, { status });

// =========================
// ⭐ REVIEWS
// =========================
export const getReviewsByWorkerIdApi = (workerId) =>
  API.get(`/reviews/worker/${workerId}`);

export const getReviewsByCustomerIdApi = (customerId) =>
  API.get(`/reviews/customer/${customerId}`);

export const addReviewApi = (data) =>
  API.post("/reviews", data);

export const updateReviewApi = (id, data) =>
  API.put(`/reviews/${id}`, data);

export const deleteReviewApi = (id) =>
  API.delete(`/reviews/${id}`);

// =========================
// 💰 TRANSACTIONS
// =========================
export const getAllTransactions = () =>
  API.get("/payments/all");