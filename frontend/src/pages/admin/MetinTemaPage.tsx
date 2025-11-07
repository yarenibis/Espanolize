import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/CrudTable";
import Navbar from "../../components/Navbar";

interface MetinTema {
  id: number;
  baslik: string;
  aciklama: string;
}

export default function MetinTemaPage() {
    const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [duzenlenecek, setDuzenlenecek] = useState<MetinTema | null>(null);

  async function fetchTemalar() {
    try {
      const res = await api.get("/admin/metinTema");
      setTemalar(res.data);
    } catch (err) {
      console.error("Temalar yüklenemedi:", err);
    }
  }

  useEffect(() => {
    fetchTemalar();
  }, []);



  async function handleAdd() {
    if (!yeniBaslik.trim() || !yeniAciklama.trim()) return alert("Tüm alanlar gerekli!");

    try {
      await api.post("/admin/metinTema", {
        baslik: yeniBaslik,
        aciklama: yeniAciklama
      });

      setYeniBaslik("");
      setYeniAciklama("");
      fetchTemalar();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }




  async function handleDelete(id: number) {
    if (!window.confirm("Bu temayı silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/admin/metinTema/${id}`);
      fetchTemalar();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }

  function startEdit(item: MetinTema) {
    setDuzenlenecek(item);
    setYeniBaslik(item.baslik);
    setYeniAciklama(item.aciklama);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    try {
      await api.put(`/admin/metinTema/${duzenlenecek.id}`, {
        baslik: yeniBaslik,
        aciklama: yeniAciklama
      });

      setDuzenlenecek(null);
      setYeniBaslik("");
      setYeniAciklama("");
      fetchTemalar();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniBaslik("");
    setYeniAciklama("");
  }



  return (
      <div className="p-6">
        <Navbar />
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