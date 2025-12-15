import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // backend adresin
  withCredentials: true, // ⭐ HttpOnly cookie için ŞART
});

// Token varsa header’a ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;