// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/Home/HomePage";
import LoginPage from "./pages/admin/Login/LoginPage";
import KonuPage from "./pages/admin/Konu/KonuPage";
import KelimeTemaPage from "./pages/admin/Kelime/KelimeTemaPage";
import KelimePage from "./pages/admin/Kelime/KelimePage";
import KelimeTemaListPage from "./pages/user/Kelime/KelimeTemaListPage";
import KelimeTemaDetailPage from "./pages/user/Kelime/KelimeTemaDetailPage";
import MetinTemaPage from "./pages/admin/Metin/MetinTemaPage";
import MetinPage from "./pages/admin/Metin/MetinPage";
import MetinTemaListPage from "./pages/user/Metin/MetinTemaListPage";
import MetinTemaDetailPage from "./pages/user/Metin/MetinTemaDetailPage";
import ProtectedRoute from "./pages/admin/Dashboard/ProtectedRoute";
import TemaPage from "./pages/admin/Tema/TemaPage";
import AdminLayout from "./pages/admin/Dashboard/AdminLayout";
import KonuListPage from "./pages/user/Konu/KonuListPage";
import KonuDetailPage from "./pages/user/Konu/KonuDetailPage";
import PrivacyPolicy from "./pages/user/Home/PrivacyPolicy";
import CookiePolicy from "./pages/user/Home/CookiePolicy";
import Terms from "./pages/user/Home/Terms";
import FAQ from "./pages/user/Home/FAQ";
import Contact from "./pages/user/Contact/Contact";
import Hakkimizda from "./pages/user/Home/Hakkimizda";
import GramerKuralPage from "./pages/admin/Kural/GramerKuralPage";
import OrnekPage from "./pages/admin/Ornek/OrnekPage";
import Dashboard from "./pages/admin/Dashboard/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/konular" element={<KonuListPage />} />
        <Route path="/konular/:id" element={<KonuDetailPage />} />
        <Route path="/kelimetemalari" element={<KelimeTemaListPage />} />
        <Route path="/kelimeler/:id" element={<KelimeTemaDetailPage />} />
        <Route path="/metinTema" element={<MetinTemaListPage />} />
        <Route path="/metinler/:id" element={<MetinTemaDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
        <Route path="/cerez-politikasi" element={<CookiePolicy />} />
        <Route path="/kullanim-kosullari" element={<Terms />} />
        <Route path="/sss" element={<FAQ />} />
        <Route path="/iletisim" element={<Contact/>} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />

        {/* Admin Routes with Layout */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Bu route'lar AdminLayout içindeki Outlet'te render edilecek */}
          <Route index element={<Dashboard />} />
          <Route path="konular" element={<KonuPage />} />
          <Route path="gramerkurallar" element={<GramerKuralPage />} />
          <Route path="ornekler" element={<OrnekPage />} />
          <Route path="kelimeTema" element={<KelimeTemaPage />} />
          <Route path="kelimeler" element={<KelimePage />} />
          <Route path="metinTema" element={<MetinTemaPage />} />
          <Route path="metinler" element={<MetinPage />} />
          <Route path="tema" element={<TemaPage />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}