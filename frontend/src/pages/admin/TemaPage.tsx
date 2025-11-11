import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import Navbar from "../../components/adminDashboard/Navbar";

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string | null;
  detayResimler: { id: number; resimUrl: string }[];
}

export default function TemaPage() {
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");

  async function load() {
  const list = await api.get("/admin/tema"); // sadece id + başlık geliyor
  const fullData = await Promise.all(
    list.data.map(async (t: any) => {
      const det = await api.get(`/admin/tema/${t.id}`);
      return det.data; // artık { kapakResmiUrl, detayResimler } var
    })
  );
  setTemalar(fullData);
}

  useEffect(() => { load(); }, []);

  async function createTema() {
    if (!yeniBaslik.trim()) return alert("Başlık gerekli");
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
    Array.from(files).forEach(f => form.append("files", f));
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
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Tema Yönetimi</h1>

      {/* --- Tema Ekle --- */}
      <div className="flex gap-2 mb-4">
        <input
          value={yeniBaslik}
          onChange={e => setYeniBaslik(e.target.value)}
          placeholder="Yeni tema başlığı"
          className="border p-2 rounded flex-1"
        />
        <button onClick={createTema} className="bg-green-600 text-white px-4 py-2 rounded">
          Ekle
        </button>
      </div>

      {/* --- Tema Listesi --- */}
      <div className="grid grid-cols-3 gap-6">
        {temalar.map(tema => (
          <div key={tema.id} className="border rounded p-4 shadow-sm">

            <h2 className="font-bold text-lg mb-2">{tema.baslik}</h2>

            {/* Kapak Görsel */}
            <img
              src={tema.kapakResmiUrl || "/no-cover.png"}
              className="w-full h-36 object-cover rounded mb-2"
            />

            <input type="file" onChange={e => uploadCover(tema.id, e.target.files![0])} />

            <div className="mt-3">
              <p className="font-semibold">Detay Görselleri:</p>
              <div className="flex flex-wrap gap-2 mt-2">
  {(tema.detayResimler ?? []).map(img => (
    <div key={img.id} className="relative">
      <img src={img.resimUrl} className="w-20 h-20 object-cover rounded" />
      <button
        onClick={() => deleteDetail(tema.id, img.resimUrl)}
        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
      >
        X
      </button>
    </div>
  ))}
</div>
            </div>

            <input type="file" multiple onChange={e => uploadDetails(tema.id, e.target.files)} />

            <button onClick={() => deleteTema(tema.id)}
              className="bg-red-600 text-white px-3 py-1 rounded w-full mt-4">
              Temayı Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
