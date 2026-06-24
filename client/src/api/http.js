import axios from "axios";

function resolveApiBaseUrl() {
  // 1. Check if running inside your compiled Android App container
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 2. Check if running on your deployed live Render static website URL
  if (window?.location?.hostname?.includes("onrender.com")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 3. Fallback for your local machine browser environment
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