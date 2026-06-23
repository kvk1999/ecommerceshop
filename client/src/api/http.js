import axios from "axios";

function resolveApiBaseUrl() {
  // 1) Prefer explicit build-time env (recommended)
  const envBaseUrl =
    import.meta?.env?.VITE_API_BASE_URL ||
    import.meta?.env?.REACT_APP_API_BASE_URL; // fallback convention

  if (envBaseUrl) {
    return envBaseUrl.replace(/\/+$/, "");
  }

  // 2) Try to use Capacitor config/env value if present (optional)
  // Prefer VITE-capacitor-style env var first
  const capEnvBaseUrl = import.meta?.env?.VITE_CAPACITOR_API_BASE_URL;
  if (capEnvBaseUrl) return capEnvBaseUrl.replace(/\/+$/, "");

  // If @capacitor/core is available, we can potentially read runtime values.
  // In most builds this will be undefined, so we fail silently.
  try {
    // @ts-ignore
    const { Plugins } = require("@capacitor/core");
    const { App } = Plugins || {};
    if (App?.baseUrl) return String(App.baseUrl).replace(/\/+$/, "");
  } catch {
    // ignore
  }

  // 3) Last resort: relative path for same-origin deployments
  // In native containers this assumes your backend is reachable at /api
  return "/api";
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
