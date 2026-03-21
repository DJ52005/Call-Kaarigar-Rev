// src/slices/Login/thunk.js
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "./reducer";
import config from "../../config/config.json";

export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  const endpoint = `${config.API_BASE_URL}/api/auth/login`;

  try {
    console.log("[login] dispatch(loginStart)");
    console.log("[login] POST:", endpoint);

    // Don't log raw password
    const safeCreds = { ...credentials };
    if ("password" in safeCreds) safeCreds.password = "***";
    console.log("[login] payload:", safeCreds);

    const response = await axios.post(endpoint, credentials);

    console.log("[login] response.status:", response.status);
    console.log("[login] response.data:", response.data);

    if (response.data && response.data.data.token) {
      console.log("[login] token found -> dispatch(loginSuccess) + save to localStorage");
      dispatch(loginSuccess(response.data.data));
      localStorage.setItem("token", response.data.data.token);
      return true;
    } else {
      console.log("[login] no token in response -> dispatch(loginFailure('Invalid credentials'))");
      dispatch(loginFailure("Invalid credentials"));
      return false;
    }
  } catch (error) {
    console.log("[login] ERROR");
    console.log("[login] error.message:", error.message);
    console.log("[login] error.response?.status:", error.response?.status);
    console.log("[login] error.response?.data:", error.response?.data);
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
    return false;
  } finally {
    console.log("[login] finished");
  }
};

export const logout = () => async (dispatch) => {
  const endpoint = `${config.API_BASE_URL}/api/users/logout`;

  try {
    console.log("[logout] start");
    const token = localStorage.getItem("token");
    console.log("[logout] has token?", !!token);

    if (!token) {
      console.log("[logout] no token -> abort logout");
      return false;
    }

    console.log("[logout] POST:", endpoint);
    const response = await axios.post(
      endpoint,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("[logout] response.status:", response.status);
    console.log("[logout] response.data:", response.data);

    localStorage.removeItem("token");
    console.log("[logout] token removed from localStorage");
    // dispatch(logoutSuccess()); // if you have it
    return true;
  } catch (error) {
    console.log("[logout] ERROR");
    console.log("[logout] error.message:", error.message);
    console.log("[logout] error.response?.status:", error.response?.status);
    console.log("[logout] error.response?.data:", error.response?.data);

    localStorage.removeItem("token"); // force logout anyway
    console.log("[logout] token removed from localStorage (forced)");
    return false;
  } finally {
    console.log("[logout] finished");
  }
};
