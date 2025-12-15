// src/components/ProtectedRoute.tsx
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../../../services/AuthService";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
  getMe()
    .then(data => {
      if (data.role === "Admin") {
        setIsAdmin(true);
      }
    })
    .catch(() => {
      setIsAdmin(false);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <p>Yükleniyor...</p>;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
