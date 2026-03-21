// src/slices/Transactions/slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions } from "./thunk";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add transaction
    // builder
    //   .addCase(addTransactionThunk.pending, (state) => {
    //     state.error = null;
    //   })
    //   .addCase(addTransactionThunk.fulfilled, (state, action) => {
    //     state.items.unshift(action.payload);
    //   })
    //   .addCase(addTransactionThunk.rejected, (state, action) => {
    //     state.error = action.payload;
    //   });
  },
});

export default transactionsSlice.reducer;
