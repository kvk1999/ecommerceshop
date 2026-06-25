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

// ==========================================================================
// LIVE DEBUG INTERCEPTOR: Pops up network failure details directly on the phone
// ==========================================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "";

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      errorMessage = `Status: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // The request was made but no response was received (e.g., CORS block or server down)
      errorMessage = `No response received from backend server.\nTarget URL: ${error.config?.baseURL}${error.config?.url}\nCheck your backend CORS configuration!`;
    } else {
      // Something went wrong setting up the request
      errorMessage = `Request Setup Error: ${error.message}`;
    }

    // Trigger a native visual window alert box directly on your mobile interface
    alert(`❌ ShopSphere API Error:\n${errorMessage}`);
    
    console.error("Capacitor Network Layer Error Log:", error);
    return Promise.reject(error);
  }
);

export default api;