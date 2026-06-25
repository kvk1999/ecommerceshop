import axios from "axios";

/**
 * Automatically determines the correct backend API URL 
 * depending on whether the app is running locally, on Render, or inside the Android APK.
 */
function resolveApiBaseUrl() {
  // 1. Android App Check (Matches Capacitor's native layer or our custom desktop spoof user agent)
  const isAndroidApp = window?.location?.origin?.startsWith("capacitor://");
  const isAndroidUserAgent = window?.navigator?.userAgent?.includes("Android");
  
  // Also checks for the custom Windows/Chrome user agent we injected into MainActivity.java to force desktop view
  const isSpoofedDesktopView = window?.navigator?.userAgent?.includes("Windows NT 10.0; Win64; x64") && !window?.location?.port;

  if (isAndroidApp || isAndroidUserAgent || isSpoofedDesktopView) {
    // Returns your uniform live cloud endpoints for all mobile modules
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 2. Check if running directly on your live deployed web frontend
  if (window?.location?.hostname?.includes("onrender.com")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 3. Fallback for your local development machine environment
  return "http://localhost:5000/api";
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
    // Safely reads the active session JWT from storage
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