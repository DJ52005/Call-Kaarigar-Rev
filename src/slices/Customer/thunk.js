// src/slices/Customer/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllUsers, createUser, editUser, deleteUser } from "../../api/backend_helper";

// 🔹 Fetch customers (role = "customer")
export const fetchCustomersThunk = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllUsers();
      return data.users.filter((u) => u.role === "customer");
    } catch (err) {
      return rejectWithValue("Failed to fetch customers");
    }
  }
);

// 🔹 Add customer
export const addCustomerThunk = createAsyncThunk(
  "customers/add",
  async (customerData, { rejectWithValue }) => {
    try {
      const { name, email, phone, password } = customerData;
      // Ensure role is always "customer"
      const res = await createUser({
        name,
        email,
        phone,
        password,
        role: "customer",
      });

      return res; // assuming createUser returns parsed JSON
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Update customer
export const updateCustomerThunk = createAsyncThunk(
  "customers/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await editUser(id, updates);
    } catch {
      return rejectWithValue("Failed to update customer");
    }
  }
);

// 🔹 Delete customer
export const deleteCustomerThunk = createAsyncThunk(
  "customers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch {
      return rejectWithValue("Failed to delete customer");
    }
  }
);
