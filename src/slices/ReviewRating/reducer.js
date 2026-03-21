import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workerReviews: [],
  customerReviews: [],
  loading: false,
  error: null,
};

const reviewRatingSlice = createSlice({
  name: "reviewRating",
  initialState,
  reducers: {
    setWorkerReviews: (state, action) => {
      state.workerReviews = action.payload;
    },
    setCustomerReviews: (state, action) => {
      state.customerReviews = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWorkerReviews,
  setCustomerReviews,
  setLoading,
  setError,
} = reviewRatingSlice.actions;

export default reviewRatingSlice.reducer;
