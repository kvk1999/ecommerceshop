import axios from "axios";

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === "string" && envUrl.length > 0) {
    return envUrl.replace(/\/+$/, "");
  }

  const userAgent = window?.navigator?.userAgent || "";
  const isNativeWebView =
    typeof window !== "undefined" &&
    (window?.Capacitor?.getPlatform?.() || /Android|iPhone|iPad|iPod/.test(userAgent));

  if (isNativeWebView) {
    return "https://ecommerceshop-hgbi.onrender.com/api";
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    const origin = window.location.origin || "";

    if (host.includes("onrender.com")) {
      return "https://ecommerceshop-hgbi.onrender.com/api";
    }

    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `${origin}/api`;
    }
  }

  return "http://localhost:5000/api";
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopsphere-token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;