import axios from "axios";

// Better environment detection
const getApiUrl = () => {
  // Check if we're in a browser and not on localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log("🔍 Detected production environment");
    return 'https://modernmart-2.onrender.com';
  }
  
  // Check Vite environment variable
  if (import.meta.env.PROD) {
    console.log("🔍 Vite detected production build");
    return 'https://modernmart-2.onrender.com';
  }
  
  console.log("🔍 Using localhost for development");
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();
console.log("🔍 Final API_URL:", API_URL);

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🚀 Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;