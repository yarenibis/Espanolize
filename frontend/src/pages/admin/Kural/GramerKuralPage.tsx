import { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import CrudTable from "../Dashboard/CrudTable";
import "./GramerKuralPage.css";

interface Konu {
  id: number;
  baslik: string;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId: number;
}

interface TableRow {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuBaslik: string;
}

export default function GramerKuralPage() {
  const [gramer, setGramer] = useState<GramerKural[]>([]);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniKonuId, setYeniKonuId] = useState<number | "">("");

  const [duzenle, setDuzenle] = useState<GramerKural | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [g, k] = await Promise.all([
        api.get("/admin/gramerkurallar"),
        api.get("/admin/konular"),
      ]);

      setGramer(g.data);
      setKonular(k.data);
    } catch (error) {
      console.error("Veri yüklenirken hata:", error);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const tableData: TableRow[] = gramer.map((g) => ({
    id: g.id,
    kuralBaslik: g.kuralBaslik,
    aciklama: g.aciklama.length > 100 ? g.aciklama.substring(0, 100) + "..." : g.aciklama,
    konuBaslik: konular.find((x) => x.id === g.konuId)?.baslik ?? "—",
  }));

  async function ekle() {
    if (!yeniBaslik || !yeniAciklama || !yeniKonuId) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/gramerkurallar", {
        kuralBaslik: yeniBaslik,
        aciklama: yeniAciklama,
        konuId: Number(yeniKonuId),
      });

      reset();
      await load();
    } catch (error) {
      console.error("Ekleme hatası:", error);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  async function guncelle() {
    if (!duzenle) return;

    if (!yeniBaslik || !yeniAciklama || !yeniKonuId) {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/gramerkurallar/${duzenle.id}`, {
        kuralBaslik: yeniBaslik,
        aciklama: yeniAciklama,
        konuId: Number(yeniKonuId),
      });

      reset();
      await load();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      setError("Güncelleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setDuzenle(null);
    setYeniBaslik("");
    setYeniAciklama("");
    setYeniKonuId("");
    setError("");
  }

  async function sil(id: number) {
    if (!confirm("Bu gramer kuralını silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/gramerkurallar/${id}`);
      await load();
    } catch (error) {
      console.error("Silme hatası:", error);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  function duzenleModunaGec(item: TableRow) {
    const target = gramer.find((g) => g.id === item.id);
    if (!target) return;

    setDuzenle(target);
    setYeniBaslik(target.kuralBaslik);
    setYeniAciklama(target.aciklama);
    setYeniKonuId(target.konuId);
    setError("");
  }

  return (
    <div className="gramer-kural-container">
      {/* Header */}
      <div className="gramer-kural-header">
        <h1 className="gramer-kural-title">Gramer Kural Yönetimi</h1>
        <p className="gramer-kural-subtitle">
          Gramer kurallarını ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="gramer-form-container">
        <h2 className="gramer-form-title">
          {duzenle ? "📝 Gramer Kuralı Düzenle" : "➕ Yeni Gramer Kuralı Ekle"}
        </h2>
        
        <div className="gramer-form-grid">
          <div className="form-group">
            <label className="form-label">
              Kural Başlığı *
            </label>
            <input 
              value={yeniBaslik} 
              onChange={(e) => setYeniBaslik(e.target.value)} 
              placeholder="Kural başlığını girin" 
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Konu *
            </label>
            <select 
              value={yeniKonuId} 
              onChange={(e) => setYeniKonuId(Number(e.target.value))} 
              className="form-select"
              disabled={loading}
            >
              <option value="">Konu Seçin</option>
              {konular.map((x) => (
                <option key={x.id} value={x.id}>{x.baslik}</option>
              ))}
            </select>
          </div>

          <div className="form-group gramer-form-full">
            <label className="form-label">
              Açıklama *
            </label>
            <textarea 
              value={yeniAciklama} 
              onChange={(e) => setYeniAciklama(e.target.value)} 
              placeholder="Kural açıklamasını detaylı bir şekilde girin..." 
              rows={4}
              className="form-textarea"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          {duzenle ? (
            <>
              <button 
                onClick={guncelle} 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Güncelleniyor..." : "✅ Güncelle"}
              </button>
              <button 
                onClick={reset} 
                disabled={loading}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </>
          ) : (
            <button 
              onClick={ekle} 
              disabled={!yeniBaslik || !yeniAciklama || !yeniKonuId || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Kural Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="gramer-form-container">
        <h2 className="gramer-form-title">📋 Mevcut Gramer Kuralları</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : gramer.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>Henüz gramer kuralı bulunmuyor</h3>
            <p>İlk gramer kuralınızı eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <CrudTable
            data={tableData}
            onEdit={duzenleModunaGec}
            onDelete={sil}
          />
        )}
      </div>
    </div>
  );
}