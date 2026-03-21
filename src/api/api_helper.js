import axios from "axios";
import config from '../config/config.json';

const API_URL = config.API_URL;
const axiosApi = axios.create({
    baseURL:API_URL,
});

// Content type
axiosApi.defaults.headers.post["Content-Type"] = "application/json";

// Intercept requests to attach the token
axiosApi.interceptors.request.use(
    (config) => {
        // Retrieve the access token (from localStorage, sessionStorage, or any storage mechanism you're using)
        const token = localStorage.getItem("token");

        if (token) {
            // Attach the token to the Authorization header
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Intercept responses to capture errors
axiosApi.interceptors.response.use(
    (response) => {
        return response.data ? response.data : response;
    },
    (error) => {
        // Handle response errors
        let message;
        switch (error.response?.status) {
            case 500: message = "Internal Server Error"; break;
            case 401: message = "Invalid credentials"; break;
            case 404: message = "Sorry! the data you are looking for could not be found"; break;
            default: message = error.message || error;
        }
        return Promise.reject(message);
    }
    
);

//profile
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // use the correct key
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


class ApiCore {
    /**
     * Fetches data from given URL
     */
    get = (url, params = {}) => {
        return axiosApi.get(url, { params });
    };

    /**
     * Posts given data to URL
     */
    post = (url, data) => {
        return axiosApi.post(url, data);
    };
};

export { ApiCore };
