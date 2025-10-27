import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/ApiService";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    kategoriler: 0,
    konular: 0,
    gramerler: 0,
    ornekler: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [kat, kon, gram, orn] = await Promise.all([
          api.get("/admin/kategoriler"),
          api.get("/admin/konular"),
          api.get("/admin/gramerkurallar"),
          api.get("/admin/ornekler"),
        ]);
        setCounts({
          kategoriler: kat.data.length,
          konular: kon.data.length,
          gramerler: gram.data.length,
          ornekler: orn.data.length,
        });
      } catch (err) {
        console.error("Veriler yüklenemedi:", err);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          👋 Hoş geldin, Admin!
        </h1>
        <p className="text-gray-600 mb-8">
          Buradan dil uygulaması içeriğini yönetebilirsin.  
          Aşağıda sistemdeki veri özetini görebilirsin:
        </p>

        {/* Özet Kutuları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold text-blue-600">
              {counts.kategoriler}
            </h2>
            <p className="text-gray-500">Kategoriler</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold text-green-600">
              {counts.konular}
            </h2>
            <p className="text-gray-500">Konular</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold text-purple-600">
              {counts.gramerler}
            </h2>
            <p className="text-gray-500">Gramer Kuralları</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold text-orange-600">
              {counts.ornekler}
            </h2>
            <p className="text-gray-500">Örnekler</p>
          </div>
        </div>

        {/* Yönetim Modülleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/admin/kategoriler")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg p-5 rounded-xl shadow transition"
          >
            📚 Kategori Yönetimi
          </button>

          <button
            onClick={() => navigate("/admin/konular")}
            className="bg-green-500 hover:bg-green-600 text-white text-lg p-5 rounded-xl shadow transition"
          >
            🧩 Konu Yönetimi
          </button>

          <button
            onClick={() => navigate("/admin/gramer")}
            className="bg-purple-500 hover:bg-purple-600 text-white text-lg p-5 rounded-xl shadow transition"
          >
            ✏️ Gramer Kuralları
          </button>

          <button
            onClick={() => navigate("/admin/ornekler")}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg p-5 rounded-xl shadow transition"
          >
            💬 Örnekler
          </button>
        </div>
      </div>
    </div>
  );
}
