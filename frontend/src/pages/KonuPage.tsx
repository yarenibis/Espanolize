import React, { useEffect, useState } from "react";
import api from "../services/ApiService";
import Navbar from "../components/Navbar";
import CrudTable from "../components/CrudTable";

interface Konu {
  id: number;
  baslik: string;
  zorluk: string;
  calismaSuresi: number;
  aciklama: string;
  kategoriId: number;
}

export default function KonuPage() {
  const [konular, setKonular] = useState<Konu[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("");
  const [yeniCalismaSuresi, setYeniCalismaSuresi] = useState<number | "">("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniKategoriId, setYeniKategoriId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<Konu | null>(null);

  // 📥 Konuları yükle
  async function fetchKonular() {
    try {
      const res = await api.get("/admin/konular");
      setKonular(res.data);
    } catch (err) {
      console.error("Konular yüklenemedi:", err);
    }
  }

  useEffect(() => {
    fetchKonular();
  }, []);

  // ➕ Yeni konu ekle
  async function handleAdd() {
    if (
      !yeniBaslik.trim() ||
      !yeniAciklama.trim() ||
      !yeniZorluk.trim() ||
      yeniCalismaSuresi === "" ||
      yeniKategoriId === ""
    )
      return alert("Tüm alanlar gerekli!");

    try {
      await api.post("/admin/konular", {
        baslik: yeniBaslik,
        zorluk: yeniZorluk,
        calismaSuresi: Number(yeniCalismaSuresi),
        aciklama: yeniAciklama,
        kategoriId: Number(yeniKategoriId),
      });

      // inputları sıfırla
      setYeniBaslik("");
      setYeniAciklama("");
      setYeniCalismaSuresi("");
      setYeniZorluk("");
      setYeniKategoriId("");

      fetchKonular();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

  // 🗑️ Sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu konuyu silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/admin/konular/${id}`);
      fetchKonular();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  // ✏️ Düzenleme moduna geç
  function startEdit(k: Konu) {
    setDuzenlenecek(k);
    setYeniBaslik(k.baslik);
    setYeniAciklama(k.aciklama);
    setYeniCalismaSuresi(k.calismaSuresi);
    setYeniZorluk(k.zorluk);
    setYeniKategoriId(k.kategoriId);
  }

  // 💾 Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    try {
      await api.put(`/admin/konular/${duzenlenecek.id}`, {
        baslik: yeniBaslik,
        zorluk: yeniZorluk,
        calismaSuresi: Number(yeniCalismaSuresi),
        aciklama: yeniAciklama,
        kategoriId: Number(yeniKategoriId),
      });

      // sıfırla
      setDuzenlenecek(null);
      setYeniAciklama("");
      setYeniBaslik("");
      setYeniCalismaSuresi("");
      setYeniKategoriId("");
      setYeniZorluk("");

      fetchKonular();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  // ❌ Düzenleme iptali
  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniAciklama("");
    setYeniBaslik("");
    setYeniCalismaSuresi("");
    setYeniKategoriId("");
    setYeniZorluk("");
  }

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Konular Yönetimi</h1>

      {/* Ekle / Düzenle Alanı */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Konu başlığı"
          value={yeniBaslik}
          onChange={(e) => setYeniBaslik(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Konu açıklaması"
          value={yeniAciklama}
          onChange={(e) => setYeniAciklama(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Konu zorluğu"
          value={yeniZorluk}
          onChange={(e) => setYeniZorluk(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Kategori ID"
          value={yeniKategoriId}
          onChange={(e) => setYeniKategoriId(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Çalışma süresi"
          value={yeniCalismaSuresi}
          onChange={(e) => setYeniCalismaSuresi(Number(e.target.value))}
          className="border p-2 rounded w-32"
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
      <CrudTable data={konular} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
}
