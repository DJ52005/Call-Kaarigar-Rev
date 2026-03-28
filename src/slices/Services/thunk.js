import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import {
  REST_CATEGORIES,
  REST_SERVICES,
} from "../../api/url_helper";
import config from "../../config/config.json";

// ---------------- CATEGORIES ----------------

// Fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "services/active",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${config.API_URL}${REST_CATEGORIES}`);
      const payload = res?.data;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload)) return payload;
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
        {
          name: categoryData.name,
          description: categoryData.description || "", // ✅ ensure always sent
        }
      );

      return res.data?.data || res.data;
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

// ---------------- SERVICES ----------------

// Fetch all services
export const fetchAllServices = createAsyncThunk(
  "services/fetchAllServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${config.API_URL}${REST_SERVICES}`);
      const payload = res?.data;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload)) return payload;
      return [];
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Update service
export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `${config.API_URL}${REST_SERVICES}/${id}`,
        updates
      );
      if (Array.isArray(res?.data?.data)) {
        const updated = res.data.data.find((s) => s._id === id);
        return updated || res.data.data[res.data.data.length - 1];
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);


// Add service
export const addService = createAsyncThunk(
  "services/addService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `${config.API_URL}${REST_SERVICES}`,
        serviceData
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

// Delete service
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${config.API_URL}${REST_SERVICES}/${serviceId}`);
      return serviceId;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);
