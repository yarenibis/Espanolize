// src/pages/LoginPage.tsx
import { useState } from "react";
import { login } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Helmet } from "react-helmet";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const navigate = useNavigate();
  

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isLocked) return;

  try {
    const data = await login(userName, password);

    if (data.role === "Admin") {
      navigate("/admin");
    } else {
      setError("Sadece admin girişi yapılabilir.");
    }
  } catch (err: any) {
    const msg = err.message || "Giriş başarısız!";
    setError(msg);

    if (msg.includes("fazla") || msg.includes("bekleyin")) {
      setIsLocked(true);
      setLockTimer(60);

      const interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setError("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }
};



  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
        <title>Admin Giriş</title>
      </Helmet>

      <div className="login-container">
        <form className="login-card" onSubmit={handleLogin}>
          <h2 className="login-title">Admin Girişi</h2>

          <input
            className="login-input"
            type="text"
            placeholder="Kullanıcı Adı"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLocked}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLocked}
          />

          {error && <p className="login-error">{error}</p>}

          {isLocked && (
            <p className="login-warning">
              Çok fazla deneme yaptınız.{lockTimer} Lütfen bekleyin.
            </p>
          )}

          <button
  className="login-button"
  type="submit"
  disabled={isLocked}
>
  {isLocked ? `Bekleyin ` : "Giriş Yap"}
</button>
        </form>
      </div>
    </>
  );
}
