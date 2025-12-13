import api from "./ApiService";

// 🔹 LOGIN — JWT token kaydet
export async function login(userName: string, password: string) {
  try {
    const res = await api.post("/account/login", { userName, password });

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error: any) {
  const status = error?.response?.status;

  if (status === 429) {
    throw new Error("Çok fazla deneme yaptınız. Lütfen bekleyin.");
  }

  throw new Error("Kullanıcı adı veya şifre hatalı.");
}
}

// 🔹 REGISTER — yeni kullanıcı
export async function register(userName: string, email: string, password: string) {
  try {
    const res = await api.post("/account/register", {
      userName,
      email,
      password,
    });

    return res.data;
  } catch (error: any) {
    console.error("Register sırasında hata:", error);

    const msg =
      error?.response?.data?.message ||
      "Kayıt işlemi sırasında bir hata oluştu.";

    throw new Error(msg);
  }
}
