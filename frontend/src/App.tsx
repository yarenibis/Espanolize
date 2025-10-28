// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import KategoriPage from "./pages/KategoriPage";
import AdminDashboard from "./pages/Dashboard";
import KonuPage from "./pages/KonuPage";
import GramerKuralPage from "./pages/GramerKuralPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/admin/kategoriler" element={
    <ProtectedRoute>
      <KategoriPage />
    </ProtectedRoute>
  }
/>

<Route path="/admin/konular" element={
  <ProtectedRoute>
    <KonuPage/>
  </ProtectedRoute>
} />

<Route path="/admin/gramerkurallar" element={
  <ProtectedRoute>
    <GramerKuralPage/>
  </ProtectedRoute>
} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
