import axios from "axios";
import config from "../config/config.json";

const axiosInstance = axios.create({
  baseURL: config.API_URL, // ✅ consistent base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
