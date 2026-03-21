import {
  setWorkerReviews,
  setCustomerReviews,
  setLoading,
  setError,
} from "./reducer";

import {
  getReviewsByWorkerIdApi,
  getReviewsByCustomerIdApi,
} from "../../api/backend_helper";

// Replace with actual worker/customer IDs if needed
const WORKER_ID = "609368b8-a106-4def-8816-7c42c68a380a";
const CUSTOMER_ID = "customer-id-if-you-have-it";

export const fetchWorkerReviewsThunk = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const reviews = await getReviewsByWorkerIdApi(WORKER_ID);
    dispatch(setWorkerReviews(reviews));
  } catch (err) {
    dispatch(setError(err));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchCustomerReviewsThunk = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const reviews = await getReviewsByCustomerIdApi(CUSTOMER_ID);
    dispatch(setCustomerReviews(reviews));
  } catch (err) {
    dispatch(setError(err));
  } finally {
    dispatch(setLoading(false));
  }
};
