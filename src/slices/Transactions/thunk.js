// src/slices/Transactions/thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTransactions } from "../../api/backend_helper";

// Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllTransactions();
      console.log("fetchTransactions raw response:", res);

      return Array.isArray(res) ? res : [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch transactions");
    }
  }
);

// Add a new transaction
// export const addTransactionThunk = createAsyncThunk(
//   "transactions/add",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await addTransactionApi(payload);
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.message || "Failed to add transaction");
//     }
//   }
// );
