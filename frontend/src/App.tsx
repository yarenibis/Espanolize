// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/Home/HomePage";
import KelimeTemaListPage from "./pages/user/Kelime/KelimeTemaListPage";
import KelimeTemaDetailPage from "./pages/user/Kelime/KelimeTemaDetailPage";
import MetinTemaListPage from "./pages/user/Metin/MetinTemaListPage";
import MetinTemaDetailPage from "./pages/user/Metin/MetinTemaDetailPage";
import ProtectedRoute from "./pages/admin/Dashboard/ProtectedRoute";
import TemaPage from "./pages/admin/Tema/TemaPage";
import KonuListPage from "./pages/user/Konu/KonuListPage";
import KonuDetailPage from "./pages/user/Konu/KonuDetailPage";
import { Suspense, lazy } from "react";

const LoginPage = lazy(() => import("./pages/admin/Login/LoginPage"));

const PrivacyPolicy = lazy(() => import("./pages/user/Home/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/user/Home/CookiePolicy"));
const Terms = lazy(() => import("./pages/user/Home/Terms"));
const FAQ = lazy(() => import("./pages/user/Home/FAQ"));
const Contact = lazy(() => import("./pages/user/Contact/Contact"));
const Hakkimizda = lazy(() => import("./pages/user/Home/Hakkimizda"));
const KelimeTemaPage =lazy(() => import("./pages/admin/Kelime/KelimeTemaPage"));
const KelimePage = lazy(()=> import("./pages/admin/Kelime/KelimePage"));
const MetinTemaPage =lazy(()=> import("./pages/admin/Metin/MetinTemaPage"));
const MetinPage = lazy(() => import("./pages/admin/Metin/MetinPage"));
const KonuPage=lazy(() => import("./pages/admin/Konu/KonuPage"));
const OrnekPage = lazy(() => import("./pages/admin/Ornek/OrnekPage"));
const GramerKuralPage = lazy(()=> import("./pages/admin/Kural/GramerKuralPage"));
const AdminLayout = lazy(() => import("./pages/admin/Dashboard/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard/Dashboard"));

export default function App() {

  function PageLoader() {
  return (
    <div style={{ padding: "80px", textAlign: "center" }}>
      Yükleniyor...
    </div>
  );
}

  return (
    <Router>
      <Suspense fallback={<div><PageLoader /></div>}>
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
      </Suspense>
    </Router>
  );
}