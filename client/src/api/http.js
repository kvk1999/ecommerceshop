import axios from "axios";

function resolveApiBaseUrl() {
  // 1. If running inside your compiled Android App bundle (APK), point to your live Render server
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 2. If running inside your live deployed website link, point to your live Render server
  if (window?.location?.hostname?.includes("onrender.com")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 3. Fallback for testing on your own computer screen (localhost:5173 -> localhost:5000)
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