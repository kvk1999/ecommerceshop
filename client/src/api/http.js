import axios from "axios";

function resolveApiBaseUrl() {
  // 1. If running inside a native Android container (APK/Emulator), route to Render cloud
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "https://ecommerceshop-web.onrender.com/api";
  }

  // 2. Fallback for regular web browsers running locally on your computer (localhost:5173)
  return "http://localhost:5000/api";
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