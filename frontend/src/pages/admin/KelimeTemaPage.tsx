import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/adminDashboard/CrudTable";

interface KelimeTema {
  id: number;
  baslik: string;
  aciklama: string;
  temaId:number;
}
interface Tema {
  id: number;
  baslik: string;
}

export default function KelimeTemaPage() {
  const [temalar, setTemalar] = useState<KelimeTema[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [duzenlenecek, setDuzenlenecek] = useState<KelimeTema | null>(null);
  const [temalarList, setTemalarList] = useState<Tema[]>([]);
const [yeniTemaId, setYeniTemaId] = useState<number | "">("");


  async function fetchTemalar() {
    try {
      const res = await api.get("/admin/kelimeTema");
      setTemalar(res.data);
    } catch (err) {
      console.error("Temalar yüklenemedi:", err);
    }
  }

  async function fetchTemalarList() {
  try {
    const res = await api.get("/admin/tema");
    setTemalarList(res.data);
  } catch (err) {
    console.error("Temalar yüklenemedi:", err);
  }
}


  useEffect(() => {
    fetchTemalar();
    fetchTemalarList();
  }, []);

  async function handleAdd() {
    if (!yeniBaslik.trim() || !yeniAciklama.trim()) return alert("Tüm alanlar gerekli!");

    try {
      await api.post("/admin/kelimeTema", {
        baslik: yeniBaslik,
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId)
      });

      setYeniBaslik("");
      setYeniAciklama("");
      setYeniTemaId("");
      fetchTemalar();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Bu temayı silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/admin/kelimeTema/${id}`);
      fetchTemalar();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  function startEdit(item: KelimeTema) {
    setDuzenlenecek(item);
    setYeniBaslik(item.baslik);
    setYeniAciklama(item.aciklama);
    setYeniTemaId(item.temaId);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    try {
      await api.put(`/admin/kelimeTema/${duzenlenecek.id}`, {
        baslik: yeniBaslik,
        aciklama: yeniAciklama,
        temaId:yeniTemaId
      });

      setDuzenlenecek(null);
      setYeniBaslik("");
      setYeniAciklama("");
      setYeniTemaId("");
      fetchTemalar();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniBaslik("");
    setYeniAciklama("");
    setYeniTemaId("");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelime Tema Yönetimi</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Tema Başlığı"
          value={yeniBaslik}
          onChange={(e) => setYeniBaslik(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />

        <input
          type="text"
          placeholder="Tema Açıklaması"
          value={yeniAciklama}
          onChange={(e) => setYeniAciklama(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />


        <select
  value={yeniTemaId}
  onChange={(e) => setYeniTemaId(Number(e.target.value))}
  className="border p-2 rounded min-w-[200px]"
>
  <option value="">Tema Seçin</option>
  {temalarList.map((tema) => (
    <option key={tema.id} value={tema.id}>
      {tema.baslik}
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

      <CrudTable data={temalar} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
}
