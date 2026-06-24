import axios from "axios";

function resolveApiBaseUrl() {
  // 1. Strict Environment Check for Android App (Capacitor runs on a native scheme)
  const isAndroidApp = 
    window?.location?.origin?.startsWith("capacitor://") || 
    window?.location?.origin?.startsWith("http://localhost") && !window?.location?.port;

  const isAndroidUserAgent = window?.navigator?.userAgent?.includes("Android");

  if (isAndroidApp || isAndroidUserAgent) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 2. Check if running on your deployed live Render web URL
  if (window?.location?.hostname?.includes("onrender.com")) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  // 3. Fallback for your local computer environment
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