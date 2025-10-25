import api from "./ApiService";

// 🔹 LOGIN — JWT token kaydet
export async function login(userName: string, password: string) {
  const res = await api.post("/account/login", { userName, password });
  
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

// 🔹 REGISTER — sadece admin oluşturma veya test amaçlı
export async function register(userName: string, email: string, password: string) {
  const res = await api.post("/account/register", { userName, email, password });
  return res.data;
}
