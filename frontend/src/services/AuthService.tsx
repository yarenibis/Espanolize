import api from "./ApiService";

// 🔹 LOGIN — token artık cookie'de
export async function login(userName: string, password: string) {
  try {
    const res = await api.post(
      "/account/login",
      { userName, password },
      { withCredentials: true } // 👈 ÇOK ÖNEMLİ
    );

    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 429) {
      throw new Error("Çok fazla deneme yaptınız. Lütfen bekleyin.");
    }

    throw new Error("Kullanıcı adı veya şifre hatalı.");
  }
}


export async function getMe() {
  const res = await api.get("/account/me");
  return res.data;
}

// 🔹 REGISTER
export async function register(userName: string, email: string, password: string) {
  try {
    const res = await api.post(
      "/account/register",
      { userName, email, password },
      { withCredentials: true }
    );

    return res.data;
  } catch (error: any) {
    throw new Error("Kayıt sırasında hata oluştu.");
  }
}

export async function logout() {
  return api.post(
    "/account/logout",
    {},
    { withCredentials: true }
  );
}
