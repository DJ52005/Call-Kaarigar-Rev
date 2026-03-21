// src/slices/Customer/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomersThunk,
  addCustomerThunk,
  updateCustomerThunk,
  deleteCustomerThunk,
} from "./thunk";

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedCustomer: null, // for view
  },
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCustomersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addCustomerThunk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // update
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // delete
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedCustomer, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
