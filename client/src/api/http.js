import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerceshop-hgbi.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopsphere-token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
