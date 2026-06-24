import axios from "axios";

function resolveApiBaseUrl() {
  // If running inside a native Android container (Emulator), route to computer's localhost via 10.0.2.2
  if (window?.Capacitor?.getPlatform() === "android" || window?.navigator?.userAgent?.includes("Android")) {
    return "http://10.0.2.2:5000/api";
  }

  // Fallback for regular web browsers running on your computer
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