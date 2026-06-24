import axios from "axios";

function resolveApiBaseUrl() {
  // 1. Check if running inside a live production build or web fallback
  // Set to true to route all mobile traffic directly to Render over the internet
  const isProduction = true; 

  if (isProduction) {
    return "https://ecommerceshop-hgbi.onrender.com/api/health"; // Replace with your Render deployment URL
  }

  // 2. Local Development Fallbacks
  // If running inside an Android Emulator, route to computer's localhost via 10.0.2.2
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "http://10.0.2.2:5000/api/health";
  }

  // Fallback for regular web browsers running on your computer
  return "http://localhost:5000/api/health";
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopsphere-token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;