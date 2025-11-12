import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import Navbar from "../../components/adminDashboard/Navbar";

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string | null;
  detayResimler?: { id: number; resimUrl: string }[];
}


export default function TemaPage() {
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");

  async function load() {
    const list = await api.get("/admin/tema");
    const fullData = await Promise.all(
      list.data.map(async (t: any) => {
        const det = await api.get(`/admin/tema/${t.id}`);
        return det.data;
      })
    );
    setTemalar(fullData);
  }

  useEffect(() => { load(); }, []);

  async function createTema() {
    if (!yeniBaslik.trim()) return alert("Başlık gerekli!");
    await api.post("/admin/tema", { baslik: yeniBaslik });
    setYeniBaslik("");
    load();
  }

  async function uploadCover(id: number, file: File) {
    const form = new FormData();
    form.append("file", file);
    await api.post(`/admin/tema/${id}/upload-cover`, form);
    load();
  }

  async function uploadDetails(id: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    await api.post(`/admin/tema/${id}/upload-details`, form);
    load();
  }

  async function deleteDetail(id: number, url: string) {
    await api.delete(`/admin/tema/${id}/details`, { params: { url } });
    load();
  }

  async function deleteTema(id: number) {
    if (!confirm("Tema ve tüm resimleri silinecek, emin misin?")) return;
    await api.delete(`/admin/tema/${id}`);
    load();
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎨 Tema Yönetimi</h1>

      {/* Yeni Tema Ekle */}
      <div className="flex gap-2 mb-8 bg-white p-4 rounded-lg shadow">
        <input
          value={yeniBaslik}
          onChange={(e) => setYeniBaslik(e.target.value)}
          placeholder="Yeni tema başlığı..."
          className="border border-gray-300 p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={createTema}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        >
          ➕ Ekle
        </button>
      </div>

      {/* Tema Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {temalar.map((tema) => (
          <div
            key={tema.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
          >
            {/* Kapak Görseli */}
            <div className="relative">
              <img
                src={tema.kapakResmiUrl || "/no-cover.png"}
                alt={tema.baslik}
                className="w-full h-48 object-cover"
              />
              <label className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded cursor-pointer hover:bg-opacity-90">
                📤 Kapak Yükle
                <input
                  type="file"
                  onChange={(e) => uploadCover(tema.id, e.target.files![0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{tema.baslik}</h2>

              {/* Galeri Görselleri */}
              <p className="text-sm font-medium text-gray-600 mb-2">
                📁 Detay Görselleri:
              </p>
              <div className="flex flex-wrap gap-2">
                {(tema.detayResimler ?? []).map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.resimUrl}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => deleteDetail(tema.id, img.resimUrl)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <label className="mt-3 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded cursor-pointer hover:bg-blue-700">
                📎 Galeri Yükle
                <input
                  type="file"
                  multiple
                  onChange={(e) => uploadDetails(tema.id, e.target.files)}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => deleteTema(tema.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full mt-4"
              >
                🗑️ Temayı Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
