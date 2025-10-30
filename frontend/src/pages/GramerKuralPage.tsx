import { useEffect, useState } from "react"
import api from "../services/ApiService"
import CrudTable from "../components/CrudTable"
import Navbar from "../components/Navbar"

interface GramerKural {
    id: number
    kuralBaslik: string 
    aciklama: string 
    konuId: number
}

interface Konu {
    id: number
    baslik: string
}

export default function GramerKuralPage() {
    const [gramer, setGramer] = useState<GramerKural[]>([]);
    const [konular, setKonular] = useState<Konu[]>([]);
    const [yeniKuralBaslik, setYeniKuralBaslik] = useState("");
    const [yeniAciklama, setYeniAciklama] = useState("");
    const [yeniKonuId, setYeniKonuId] = useState<number | "">("");
    const [duzenlenecek, setDuzenlenecek] = useState<GramerKural | null>(null);
    const [loading, setLoading] = useState(true);

    // Konuları API'den çek
    async function getKonular(){
        try{
            const res = await api.get("/admin/konular");
            setKonular(res.data);
        } catch(err) {
            console.error("Konular yüklenemedi:", err);
        }
    }

    async function getAll(){
        try{
            const res = await api.get("/admin/gramerkurallar");
            setGramer(res.data);
        } catch(err) {
            console.error("Kurallar yüklenemedi:", err);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Önce konuları, sonra kuralları yükle
            await getKonular();
            await getAll();
            setLoading(false);
        };
        loadData();
    }, [])

    // Konu ID'sine göre konu başlığını bul
    const getKonuBaslik = (konuId: number) => {
        const konu = konular.find(k => k.id === konuId);
        return konu ? konu.baslik : `Konu ID: ${konuId}`;
    };

    // Tablo için düzenlenmiş data oluştur (konu başlıkları ile)
    const tabloData = gramer.map(kural => ({
        id: kural.id,
        kuralBaslik: kural.kuralBaslik,
        aciklama:kural.aciklama,
        konuBaslik: getKonuBaslik(kural.konuId)
    }));

    async function handleAdd(){
        if(!yeniAciklama.trim() || !yeniKuralBaslik.trim() || yeniKonuId === "") 
            return alert("Tüm alanlar gerekli!");
        
        try{
            await api.post(`/admin/gramerkurallar`, {
                kuralBaslik: yeniKuralBaslik,
                aciklama: yeniAciklama,
                konuId: Number(yeniKonuId)
            });

            setYeniAciklama("");
            setYeniKuralBaslik("");
            setYeniKonuId("");
            getAll();
        } catch(err) {
            console.error("Ekleme hatası:", err);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm("Bu kuralı silmek istediğine emin misin?")) return;
        try{
            await api.delete(`/admin/gramerkurallar/${id}`);
            getAll();
        } catch(err) {
            console.error("Silme hatası:", err);
        }
    }

    function startEdit(k: GramerKural) {
        setDuzenlenecek(k);
        setYeniKuralBaslik(k.kuralBaslik);
        setYeniAciklama(k.aciklama);
        setYeniKonuId(k.konuId);
    }

    async function handleUpdate() {
        if (!duzenlenecek) return;

        try {
            await api.put(`/admin/gramerkurallar/${duzenlenecek.id}`, {
                kuralBaslik: yeniKuralBaslik,
                aciklama: yeniAciklama,
                konuId: Number(yeniKonuId)
            });

            setDuzenlenecek(null);
            setYeniAciklama("");
            setYeniKuralBaslik("");
            setYeniKonuId("");
            getAll();
        } catch (err) {
            console.error("Güncelleme hatası:", err);
        }
    }

    function cancelEdit() {
        setDuzenlenecek(null);
        setYeniAciklama("");
        setYeniKuralBaslik("");
        setYeniKonuId("");
    };

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
            <h1 className="text-2xl font-bold mb-4">Gramer Kural Yönetimi</h1>

            {/* Ekle / Düzenle Alanı */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Kural başlığı"
                    value={yeniKuralBaslik}
                    onChange={(e) => setYeniKuralBaslik(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
                <input
                    type="text"
                    placeholder="Kural açıklaması"
                    value={yeniAciklama}
                    onChange={(e) => setYeniAciklama(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
                
                {/* Konu seçimi için dropdown */}
                <select
                    value={yeniKonuId}
                    onChange={(e) => setYeniKonuId(Number(e.target.value))}
                    className="border p-2 rounded min-w-[200px]"
                >
                    <option value="">Konu Seçin</option>
                    {konular.map((konu) => (
                        <option key={konu.id} value={konu.id}>
                            {konu.baslik}
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
                    // Orijinal gramer kuralını bul (konuId ile)
                    const originalKural = gramer.find(k => k.id === item.id);
                    if (originalKural) {
                        startEdit(originalKural);
                    }
                }}
                onDelete={handleDelete}
            />
        </div>
    );
}