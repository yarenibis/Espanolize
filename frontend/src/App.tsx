// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import KategoriPage from "./pages/admin/KategoriPage";
import AdminDashboard from "./pages/admin/Dashboard";
import KonuPage from "./pages/admin/KonuPage";
import GramerKuralPage from "./pages/admin/GramerKuralPage";
import OrnekPage from "./pages/admin/OrnekPage";
import GramerKonuSayfasi from "./pages/user/GramerListPage.tsx";
import GramerListPage from "./pages/user/GramerListPage.tsx";
import GramerDetailPage from "./pages/user/GramerDetailPage.tsx";
import KelimeTemaPage from "./pages/admin/KelimeTemaPage.tsx";
import KelimePage from "./pages/admin/KelimePage.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gramerkurallar" element={<GramerListPage/>}/>
        <Route path="/gramer/:id" element={<GramerDetailPage />} />
      
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

<Route path="/admin/ornekler" element={
  <ProtectedRoute>
    <OrnekPage/>
  </ProtectedRoute>
} />

<Route path="/admin/kelimeTema" element={
    <ProtectedRoute>
      <KelimeTemaPage />
    </ProtectedRoute>
  }
/>

<Route path="/admin/kelimeler" element={
    <ProtectedRoute>
      <KelimePage />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
