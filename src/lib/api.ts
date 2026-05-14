import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the JWT token to the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kick_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => {
    // If the response is wrapped by the TransformInterceptor, return the inner data
    if (response.data && response.data.data !== undefined && response.data.statusCode) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Wipe all local auth data to prevent stale state loops
      localStorage.removeItem("kick_admin_token");
      localStorage.removeItem("kick-admin-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
