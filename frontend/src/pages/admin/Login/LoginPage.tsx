// src/pages/LoginPage.tsx
import { useState } from "react";
import { login } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"
import { Helmet } from "react-helmet";

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
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
        <title>Admin Giriş</title>
      </Helmet>

      {/* Login tasarımın */}
    <div className="login-container">
  <form className="login-card" onSubmit={handleLogin}>
    <h2 className="login-title">Admin Girişi</h2>

    <input
      className="login-input"
      type="text"
      placeholder="Kullanıcı Adı"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />

    <input
      className="login-input"
      type="password"
      placeholder="Şifre"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {error && <p className="login-error">{error}</p>}

    <button className="login-button" type="submit">
      Giriş Yap
    </button>
  </form>
</div>
</>

  );
}
