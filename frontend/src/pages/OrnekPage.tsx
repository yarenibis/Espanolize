import { useEffect, useState } from "react";
import api from "../services/ApiService";
import CrudTable from "../components/CrudTable";
import Navbar from "../components/Navbar";

interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama: string;
  gramerKuralId: number;
}

export default function OrnekPage() {
  const [ornek, setOrnek] = useState<Ornek[]>([]);
  const [yeniIspanyolcaOrnek, setYeniIspanyolcaOrnek] = useState("");
  const [yeniCeviri, setYeniCeviri] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniGramerKuralId, setYeniGramerKuralId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<Ornek | null>(null);

  async function fetchData() {
    try {
      const res = await api.get(`/admin/ornekler`);
      setOrnek(res.data);
    } catch (err) {
      console.error("data alınamadı", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAdd() {
    if (
      !yeniIspanyolcaOrnek.trim() ||
      !yeniCeviri.trim() ||
      !yeniAciklama.trim() ||
      yeniGramerKuralId === ""
    )
      return alert("Tüm alanlar zorunludur!");

    try {
      await api.post(`/admin/ornekler`, {
        ispanyolcaOrnek: yeniIspanyolcaOrnek,
        ceviri: yeniCeviri,
        aciklama: yeniAciklama,
        gramerKuralId: Number(yeniGramerKuralId),
      });

      setYeniIspanyolcaOrnek("");
      setYeniCeviri("");
      setYeniAciklama("");
      setYeniGramerKuralId("");
      fetchData();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Bu örneği silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/admin/ornekler/${id}`);
      fetchData();
    } catch (err) {
      console.error("Silme hatası", err);
    }
  }

  function StartEdit(o: Ornek) {
    setDuzenlenecek(o);
    setYeniIspanyolcaOrnek(o.ispanyolcaOrnek);
    setYeniCeviri(o.ceviri);
    setYeniAciklama(o.aciklama);
    setYeniGramerKuralId(o.gramerKuralId);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;
    try {
      await api.put(`/admin/ornekler/${duzenlenecek.id}`, {
        ispanyolcaOrnek: yeniIspanyolcaOrnek,
        ceviri: yeniCeviri,
        aciklama: yeniAciklama,
        gramerKuralId: Number(yeniGramerKuralId),
      });

      setDuzenlenecek(null);
      setYeniIspanyolcaOrnek("");
      setYeniCeviri("");
      setYeniAciklama("");
      setYeniGramerKuralId("");
      fetchData();
    } catch (err) {
      console.error("update hatası", err);
    }
  }

  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniIspanyolcaOrnek("");
    setYeniCeviri("");
    setYeniAciklama("");
    setYeniGramerKuralId("");
  }

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Örnek Yönetimi</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="İspanyolca örnek"
          value={yeniIspanyolcaOrnek}
          onChange={(e) => setYeniIspanyolcaOrnek(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Çeviri"
          value={yeniCeviri}
          onChange={(e) => setYeniCeviri(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={yeniAciklama}
          onChange={(e) => setYeniAciklama(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Gramer Kural ID"
          value={yeniGramerKuralId}
          onChange={(e) => setYeniGramerKuralId(Number(e.target.value))}
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

      <CrudTable data={ornek} onEdit={StartEdit} onDelete={handleDelete} />
    </div>
  );
}
