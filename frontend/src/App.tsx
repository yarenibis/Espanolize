// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import KonuPage from "./pages/admin/KonuPage";
import GramerKuralPage from "./pages/admin/GramerKuralPage";
import OrnekPage from "./pages/admin/OrnekPage";
import KelimeTemaPage from "./pages/admin/KelimeTemaPage";
import KelimePage from "./pages/admin/KelimePage";
import KelimeTemaListPage from "./pages/user/KelimeTemaListPage";
import KelimeTemaDetailPage from "./pages/user/KelimeTemaDetailPage";
import MetinTemaPage from "./pages/admin/MetinTemaPage";
import MetinPage from "./pages/admin/MetinPage";
import MetinTemaListPage from "./pages/user/MetinTemaListPage";
import MetinTemaDetailPage from "./pages/user/MetinTemaDetailPage";
import ProtectedRoute from "./components/adminDashboard/ProtectedRoute";
import TemaPage from "./pages/admin/TemaPage";
import AdminLayout from "./components/adminDashboard/AdminLayout";
import KonuListPage from "./pages/user/KonuListPage";
import KonuDetailPage from "./pages/user/KonuDetailPage";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import CookiePolicy from "./pages/user/CookiePolicy";
import Terms from "./pages/user/Terms";
import FAQ from "./pages/user/FAQ";
import Contact from "./pages/user/Contact";
import Hakkimizda from "./components/Hakkimizda";

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