import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/adminDashboard/CrudTable";

interface Metin {
  id: number;
  icerik: string;
  ceviri: string;
  zorluk:string;
  metinTemaId: number;
}

interface MetinTema {
  id: number;
  baslik: string;
}

export default function KelimePage() {
  const [metinler, setMetinler] = useState<Metin[]>([]);
  const [temalar, setTemalar] = useState<MetinTema[]>([]);

  const [yeniIcerik, setYeniIcerik] = useState("");
  const [yeniCeviri, setYeniCeviri] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Metin | null>(null);

  async function fetchAll() {
    try {
      const kelimeRes = await api.get("/admin/metinler");
      const temaRes = await api.get("/admin/metinTema");
      setMetinler(kelimeRes.data);
      setTemalar(temaRes.data);
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);



  async function handleAdd() {
    if (!yeniCeviri.trim() || !yeniIcerik.trim() || yeniTemaId === ""  || !yeniZorluk.trim())
      return alert("Tüm alanlar zorunludur.");

    try {
      await api.post("/admin/metinler", {
        ceviri: yeniCeviri,
        icerik: yeniIcerik,
        zorluk:yeniZorluk,
        metinTemaId: Number(yeniTemaId),
      });

      setYeniCeviri("");
      setYeniIcerik("");
      setYeniZorluk("");
      setYeniTemaId("");
      fetchAll();
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  }

   
  async function handleDelete(id: number) {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    await api.delete(`/admin/metinler/${id}`);
    fetchAll();
  }

  function startEdit(k: Metin) {
    setDuzenlenecek(k);
    setYeniCeviri(k.ceviri);
    setYeniIcerik(k.icerik);
    setYeniZorluk(k.zorluk)
    setYeniTemaId(k.metinTemaId);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    await api.put(`/admin/metinler/${duzenlenecek.id}`, {
      ceviri: yeniCeviri,
        icerik: yeniIcerik,
        zorluk:yeniZorluk,
        metinTemaId: Number(yeniTemaId),
    });

    setDuzenlenecek(null);
    setYeniCeviri("");
    setYeniIcerik("");
    setYeniZorluk("");
    setYeniTemaId("");
    fetchAll();
  }

  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniCeviri("");
      setYeniIcerik("");
      setYeniZorluk("");
    setYeniTemaId("");
  }

  const tabloData = metinler.map((k) => ({
    id: k.id,
    ceviri: k.ceviri,
    icerik: k.icerik,
    zorluk:k.zorluk,
    tema: temalar.find((t) => t.id === k.metinTemaId)?.baslik || "-",
  }));


  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Kelime Yönetimi</h1>
  
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="icerik"
            value={yeniIcerik}
            onChange={(e) => setYeniIcerik(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[150px]"
          />
          <input
            type="text"
            placeholder="çeviri"
            value={yeniCeviri}
            onChange={(e) => setYeniCeviri(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[150px]"
          />

           <input
            type="text"
            placeholder="zorluk"
            value={yeniZorluk}
            onChange={(e) => setYeniZorluk(e.target.value)}
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