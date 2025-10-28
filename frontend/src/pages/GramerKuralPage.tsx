import { useEffect, useState } from "react"
import api from "../services/ApiService"
import CrudTable from "../components/CrudTable"
import Navbar from "../components/Navbar"

 interface GramerKural{
    id:number
    kuralBaslik:string 
    aciklama:string 
    konuId:number
}

export default function GramerKuralPage() {
     const [gramer, setGramer] = useState<GramerKural[]>([]);
      const [yeniKuralBaslik, setYeniKuralBaslik] = useState("");
      const [yeniAciklama, setYeniAciklama] = useState("");
      const [yeniKonuId, setYeniKonuId] = useState<number | "">("");
      const [duzenlenecek, setDuzenlenecek] = useState<GramerKural | null>(null);


      async function getAll(){
        try{
           const res= await api.get("/admin/gramerkurallar");
           setGramer(res.data);
        }catch(err) {
           console.error("Konular yüklenemedi:", err);
        }
      }

      useEffect(()=>{
        getAll();
      }, [])
    
      async function handleAdd(){
        if(
            !yeniAciklama.trim() ||
            !yeniKuralBaslik.trim() ||
             yeniKonuId === "" 
        )
            return alert("Tüm alanlar gerekli!");
      try{
         await api.post(`/admin/gramerkurallar`,{
            kuralBaslik:yeniKuralBaslik,
            aciklama:yeniAciklama,
            konuId:Number(yeniKonuId)
         });

         //input sıfırla
         setYeniAciklama("");
         setYeniKuralBaslik("");
         setYeniKonuId("");
         getAll();
      }catch(err){
         console.error("Ekleme hatası:", err);
      }
      }



      async function handleDelete(id:number) {
        if (!window.confirm("Bu konuyu silmek istediğine emin misin?")) return;
        try{
           await api.delete(`/admin/gramerkurallar/${id}`);
           getAll();
        }catch(err){
           console.error("Ekleme hatası:", err);
        }
      }


      // ✏️ Düzenleme moduna geç
  function startEdit(k: GramerKural) {
    setDuzenlenecek(k);
    setYeniKuralBaslik(k.kuralBaslik);
    setYeniAciklama(k.aciklama);
    setYeniKonuId(k.konuId);
  }

  // 💾 Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    try {
      await api.put(`/admin/gramerkurallar/${duzenlenecek.id}`, {
            kuralBaslik:yeniKuralBaslik,
            aciklama:yeniAciklama,
            konuId:Number(yeniKonuId)
      });

      // sıfırla
      setDuzenlenecek(null);
      setYeniAciklama("");
      setYeniKuralBaslik("");
      setYeniKonuId("");

      getAll();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  }

  // Düzenleme iptali
  function cancelEdit() {
    setDuzenlenecek(null);
    setYeniAciklama("");
    setYeniKuralBaslik("");
    setYeniKonuId("");

  };

  return (
      <div className="p-6">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Gramer kural Yönetimi</h1>
  
        {/* Ekle / Düzenle Alanı */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Kural başlığı"
            value={yeniKuralBaslik}
            onChange={(e) => setYeniKuralBaslik(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="kural açıklaması"
            value={yeniAciklama}
            onChange={(e) => setYeniAciklama(e.target.value)}
            className="border p-2 rounded flex-1"
          />
         
          <input
            type="number"
            placeholder="Konu ID"
            value={yeniKonuId}
            onChange={(e) => setYeniKonuId(Number(e.target.value))}
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
        <CrudTable data={gramer} onEdit={startEdit} onDelete={handleDelete} />
      </div>
    );
}