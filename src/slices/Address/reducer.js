// src/slices/Address/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../../api/backend_helper";

const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchAddressesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAddressesSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload; // ✅ Only plain data
    },
    fetchAddressesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAddressesStart, fetchAddressesSuccess, fetchAddressesFailure } = addressSlice.actions;

// ---------- THUNKS ----------
export const fetchAddresses = () => async (dispatch) => {
  dispatch(fetchAddressesStart());
  try {
    const res = await getAddresses();
    dispatch(fetchAddressesSuccess(res.data)); // ✅ Only data
  } catch (error) {
    dispatch(fetchAddressesFailure(error.message));
  }
};

export const createAddress = (addressData) => async (dispatch) => {
  try {
    await addAddress(addressData);
    dispatch(fetchAddresses());
  } catch (error) {
    console.error(error);
  }
};

export const editAddress = (id, addressData) => async (dispatch) => {
  try {
    await updateAddress(id, addressData);
    dispatch(fetchAddresses());
  } catch (error) {
    console.error(error);
  }
};

export const removeAddress = (id) => async (dispatch) => {
  try {
    await deleteAddress(id);
    dispatch(fetchAddresses());
  } catch (error) {
    console.error(error);
  }
};

export default addressSlice.reducer;
