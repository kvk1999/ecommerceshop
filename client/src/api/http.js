import axios from "axios";

/**
 * Automatically determines the correct backend API URL 
 * depending on whether the app is running locally, on Render, or inside the Android APK.
 */
const DEFAULT_API_BASE_URL = "https://ecommerceshop-hgbi.onrender.com/api";
const LOCAL_API_BASE_URL = "http://localhost:5000/api";

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === "string" && envUrl.length > 0) {
    return envUrl.replace(/\/+$/, "");
  }

  const isAndroidApp = window?.location?.origin?.startsWith("capacitor://");
  const isAndroidUserAgent = window?.navigator?.userAgent?.includes("Android");
  const isSpoofedDesktopView =
    window?.navigator?.userAgent?.includes("Windows NT 10.0; Win64; x64") &&
    !window?.location?.port;

  if (isAndroidApp || isAndroidUserAgent || isSpoofedDesktopView) {
    return DEFAULT_API_BASE_URL;
  }

  const hostname = window?.location?.hostname || "";
  if (hostname.includes("onrender.com")) {
    return DEFAULT_API_BASE_URL;
  }

  if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${window.location.origin}/api`;
  }

  return LOCAL_API_BASE_URL;
}

// Create the unified Axios instance
const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically attach authorization tokens to backend requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shopsphere-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;