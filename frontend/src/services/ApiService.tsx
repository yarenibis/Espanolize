import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // 🔑 BU OLMAZSA 401 ALIRSIN
});

export default api;
