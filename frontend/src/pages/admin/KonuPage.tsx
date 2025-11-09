import React, { useEffect, useState } from "react";
import api from "../../services/ApiService";
import Navbar from "../../components/adminDashboard/Navbar";
import CrudTable from "../../components/adminDashboard/CrudTable";

interface Konu {
  id: number;
  baslik: string;
  zorluk: string;
  calismaSuresi: number;
  aciklama: string;
  kategoriId: number;
}

interface Kategori{
  id: number;
  ad: string;
}

export default function KonuPage() {
  const [konular, setKonular] = useState<Konu[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("");
  const [yeniCalismaSuresi, setYeniCalismaSuresi] = useState<number | "">("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniKategoriId, setYeniKategoriId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<Konu | null>(null);
  const [loading, setLoading] = useState(true);

  //kategorileri yükle
  async function getKategoriler(){
    try{
      const res = await api.get("/admin/kategoriler");
      setKategoriler(res.data);
    }catch (err) {
      console.error("kategoriler yüklenemedi:", err);
    }

  }
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
        const loadData = async () => {
            setLoading(true);
            // Önce konuları, sonra kuralları yükle
            await fetchKonular();
            await getKategoriler();
            setLoading(false);
        };
        loadData();
    }, [])


  // Konu ID'sine göre konu başlığını bul
    const getKategoriBaslik = (kategoriId: number) => {
        const kategori = kategoriler.find(k => k.id === kategoriId);
        return kategori ? kategori.ad : `Konu ID: ${kategoriId}`;
    };

    // Tablo için düzenlenmiş data oluştur (konu başlıkları ile)
    const tabloData = konular.map(konu => ({
        id: konu.id,
  baslik: konu.baslik,
  zorluk: konu.zorluk,
  calismaSuresi: konu.calismaSuresi,
  aciklama: konu.aciklama,
        Ad: getKategoriBaslik(konu.kategoriId)
    }));

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

  //  Düzenleme iptali
  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniAciklama("");
    setYeniBaslik("");
    setYeniCalismaSuresi("");
    setYeniKategoriId("");
    setYeniZorluk("");
  }

if (loading) {
        return (
            <div className="p-6">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Yükleniyor...</div>
                </div>
            </div>
        );
    }


   return (
        <div className="p-6">
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Konu Yönetimi</h1>

            {/* Ekle / Düzenle Alanı */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Konu başlığı"
                    value={yeniBaslik}
                    onChange={(e) => setYeniBaslik(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
                <input
                    type="text"
                    placeholder="Konu açıklaması"
                    value={yeniAciklama}
                    onChange={(e) => setYeniAciklama(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
                
                <input
                    type="text"
                    placeholder="çalışma süresi"
                    value={yeniCalismaSuresi}
                    onChange={(e) => setYeniCalismaSuresi(Number(e.target.value))}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />

                <input
                    type="text"
                    placeholder="Konu zorluk"
                    value={yeniZorluk}
                    onChange={(e) => setYeniZorluk(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />

                {/* Konu seçimi için dropdown */}
                <select
                    value={yeniKategoriId}
                    onChange={(e) => setYeniKategoriId(Number(e.target.value))}
                    className="border p-2 rounded min-w-[200px]"
                >
                    <option value="">Konu Seçin</option>
                    {kategoriler.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>
                            {kategori.ad}
                        </option>
                    ))}
                </select>

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

            {/* CrudTable kullanımı */}
            <CrudTable 
                data={tabloData} 
                onEdit={(item) => {
                    const originalKural = konular.find(k => k.id === item.id);
                    if (originalKural) {
                        startEdit(originalKural);
                    }
                }}
                onDelete={handleDelete}
            />
        </div>
    );
}
