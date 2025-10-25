// src/pages/LoginPage.tsx
import { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(userName, password);
      if (data.role === "Admin") {
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        setError("Sadece admin girişi yapılabilir.");
      }
    } catch (err: any) {
      setError(err.response?.data || "Giriş başarısız!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Admin Girişi</h2>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 w-full rounded"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
