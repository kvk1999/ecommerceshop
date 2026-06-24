import axios from "axios";

function resolveApiBaseUrl() {
  // 1. If running inside a native Android container (APK) or Android Webview, point to Render
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "https://ecommerceshop-web.onrender.com/api";
  }

  // 2. Fallback for your local computer browser (localhost:5173 -> localhost:5000)
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