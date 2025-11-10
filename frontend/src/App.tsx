// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import KategoriPage from "./pages/admin/KategoriPage";
import AdminDashboard from "./pages/admin/Dashboard";
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
import AdminGramerImageUploadPage from "./pages/admin/GramerKuralImageUploadPage";
import GramerKuralImagesPage from "./pages/admin/GramerKuralImageUploadPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gramerkurallar" element={<GramerListPage/>}/>
        <Route path="/gramer/:id" element={<GramerDetailPage />} />

        <Route path="/kelimetemalari" element={<KelimeTemaListPage />} />
        <Route path="/kelimeler/:id" element={<KelimeTemaDetailPage />} />


        <Route path="/metinTema" element={<MetinTemaListPage />} />
        <Route path="/metinler/:id" element={<MetinTemaDetailPage />} />
      
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


<Route path="/admin/metinTema" element={
    <ProtectedRoute>
      <MetinTemaPage />
    </ProtectedRoute>
  }
/>

<Route path="/admin/metinler" element={
    <ProtectedRoute>
      <MetinPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/gramerkurallar/:id/images"
  element={
    <ProtectedRoute>
      <GramerKuralImagesPage />
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>

  );
}
