import { useEffect, useState } from "react";
import api from "../services/ApiService";
import CrudTable from "../components/CrudTable";
import Navbar from "../components/Navbar";

interface Kategori {
  id: number;
  ad: string;
  sira: number;
}

export default function KategoriPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yeniAd, setYeniAd] = useState("");
  const [yeniSira, setYeniSira] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<Kategori | null>(null);

  // 📥 Kategorileri yükle
  async function fetchKategoriler() {
    try {
      const res = await api.get("/admin/kategoriler");
      setKategoriler(res.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  }

  useEffect(() => {
    fetchKategoriler();
  }, []);

  // ➕ Yeni kategori ekle
  async function handleAdd() {
    if (!yeniAd.trim() || yeniSira === "") return alert("Ad ve sıra gerekli!");
    try {
      await api.post("/admin/kategoriler", { ad: yeniAd, sira: yeniSira });
      setYeniAd("");
      setYeniSira("");
      fetchKategoriler();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

  // 🗑️ Sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/admin/kategoriler/${id}`);
      fetchKategoriler();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  // ✏️ Düzenleme moduna geç
  function startEdit(k: Kategori) {
    setDuzenlenecek(k);
    setYeniAd(k.ad);
    setYeniSira(k.sira);
  }

  // 💾 Güncelleme
  async function handleUpdate() {
    if (!duzenlenecek) return;
    try {
      await api.put(`/admin/kategoriler/${duzenlenecek.id}`, {
        ad: yeniAd,
        sira: yeniSira,
      });
      setDuzenlenecek(null);
      setYeniAd("");
      setYeniSira("");
      fetchKategoriler();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  // ❌ Düzenleme iptali
  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniAd("");
    setYeniSira("");
  }

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Kategoriler Yönetimi</h1>

      {/* Ekle / Düzenle Alanı */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Kategori adı"
          value={yeniAd}
          onChange={(e) => setYeniAd(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Sıra"
          value={yeniSira}
          onChange={(e) => setYeniSira(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
        {duzenlenecek ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Güncelle
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              İptal
            </button>
          </>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Ekle
          </button>
        )}
      </div>

      {/* Tablo */}
      <CrudTable data={kategoriler} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
}
