// src/pages/Dashboard.tsx
import { Routes, Route } from "react-router-dom";
import KategoriPage from "../pages/KategoriPage";

import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="kategoriler" element={<KategoriPage />} />

      </Routes>
    </div>
  );
}
