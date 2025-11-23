// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import KonuPage from "./pages/admin/KonuPage";
import GramerKuralPage from "./pages/admin/GramerKuralPage";
import OrnekPage from "./pages/admin/OrnekPage";
import GramerListPage from "./pages/user/GramerListPage";
import GramerDetailPage from "./pages/user/GramerDetailPage";
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gramerkurallar" element={<GramerListPage/>}/>
        <Route path="/gramer/:id" element={<GramerDetailPage />} />
        <Route path="/kelimetemalari" element={<KelimeTemaListPage />} />
        <Route path="/kelimeler/:id" element={<KelimeTemaDetailPage />} />
        <Route path="/metinTema" element={<MetinTemaListPage />} />
        <Route path="/metinler/:id" element={<MetinTemaDetailPage />} />
        <Route path="/login" element={<LoginPage />} />

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