import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/adminDashboard/CrudTable";

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
  kelimeTemasiId: number;
}

interface KelimeTema {
  id: number;
  baslik: string;
}

export default function KelimePage() {
  const [kelimeler, setKelimeler] = useState<Kelime[]>([]);
  const [temalar, setTemalar] = useState<KelimeTema[]>([]);

  const [yeniIspanyolca, setYeniIspanyolca] = useState("");
  const [yeniTurkce, setYeniTurkce] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Kelime | null>(null);

  async function fetchAll() {
    try {
      const kelimeRes = await api.get("/admin/kelimeler");
      const temaRes = await api.get("/admin/kelimeTema");
      setKelimeler(kelimeRes.data);
      setTemalar(temaRes.data);
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleAdd() {
    if (!yeniIspanyolca.trim() || !yeniTurkce.trim() || yeniTemaId === "")
      return alert("Tüm alanlar zorunludur.");

    try {
      await api.post("/admin/kelimeler", {
        ispanyolca: yeniIspanyolca,
        turkce: yeniTurkce,
        kelimeTemasiId: Number(yeniTemaId),
      });

      setYeniIspanyolca("");
      setYeniTurkce("");
      setYeniTemaId("");
      fetchAll();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    await api.delete(`/admin/kelimeler/${id}`);
    fetchAll();
  }

  function startEdit(k: Kelime) {
    setDuzenlenecek(k);
    setYeniIspanyolca(k.ispanyolca);
    setYeniTurkce(k.turkce);
    setYeniTemaId(k.kelimeTemasiId);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    await api.put(`/admin/kelimeler/${duzenlenecek.id}`, {
      ispanyolca: yeniIspanyolca,
      turkce: yeniTurkce,
      kelimeTemasiId: Number(yeniTemaId),
    });

    setDuzenlenecek(null);
    setYeniIspanyolca("");
    setYeniTurkce("");
    setYeniTemaId("");
    fetchAll();
  }

  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniIspanyolca("");
    setYeniTurkce("");
    setYeniTemaId("");
  }

  const tabloData = kelimeler.map((k) => ({
    id: k.id,
    ispanyolca: k.ispanyolca,
    turkce: k.turkce,
    tema: temalar.find((t) => t.id === k.kelimeTemasiId)?.baslik || "-",
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelime Yönetimi</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="İspanyolca"
          value={yeniIspanyolca}
          onChange={(e) => setYeniIspanyolca(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <input
          type="text"
          placeholder="Türkçe"
          value={yeniTurkce}
          onChange={(e) => setYeniTurkce(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <select
          className="border p-2 rounded min-w-[200px]"
          value={yeniTemaId}
          onChange={(e) => setYeniTemaId(Number(e.target.value))}
        >
          <option value="">Tema Seç</option>
          {temalar.map((t) => (
            <option key={t.id} value={t.id}>
              {t.baslik}
            </option>
          ))}
        </select>

        {duzenlenecek ? (
          <>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>
              Güncelle
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={cancelEdit}>
              İptal
            </button>
          </>
        ) : (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAdd}>
            Ekle
          </button>
        )}
      </div>

      <CrudTable data={tabloData} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
}
