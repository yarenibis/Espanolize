import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/adminDashboard/CrudTable";
import "./OrnekPage.css";

interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama: string;
  gramerKuralId: number;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
}

export default function OrnekPage() {
  const [ornekler, setOrnekler] = useState<Ornek[]>([]);
  const [gramerKurallar, setGramerKurallar] = useState<GramerKural[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniIspanyolcaOrnek, setYeniIspanyolcaOrnek] = useState("");
  const [yeniCeviri, setYeniCeviri] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniGramerKuralId, setYeniGramerKuralId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Ornek | null>(null);

  // Gramer kurallarını yükle
  async function getGramerKurallar() {
    try {
      const res = await api.get("/admin/gramerkurallar");
      setGramerKurallar(res.data);
    } catch (err) {
      console.error("Gramer kuralları yüklenemedi:", err);
      setError("Gramer kuralları yüklenirken bir hata oluştu.");
    }
  }

  // Örnekleri yükle
  async function fetchOrnekler() {
    try {
      const res = await api.get("/admin/ornekler");
      setOrnekler(res.data);
    } catch (err) {
      console.error("Örnekler yüklenemedi:", err);
      setError("Örnekler yüklenirken bir hata oluştu.");
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([getGramerKurallar(), fetchOrnekler()]);
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Gramer kural ID'sine göre kural başlığını bul
  const getGramerBaslik = (gramerKuralId: number) => {
    const kural = gramerKurallar.find(t => t.id === gramerKuralId);
    return kural ? kural.kuralBaslik : `Kural ID: ${gramerKuralId}`;
  };

  // Tablo için düzenlenmiş data oluştur
  const tableData = ornekler.map(ornek => ({
    id: ornek.id,
    ispanyolcaOrnek: ornek.ispanyolcaOrnek,
    ceviri: ornek.ceviri,
    aciklama: ornek.aciklama.length > 100 ? ornek.aciklama.substring(0, 100) + "..." : ornek.aciklama,
    kuralBaslik: getGramerBaslik(ornek.gramerKuralId)
  }));

  // Yeni örnek ekle
  async function handleAdd() {
    if (!yeniIspanyolcaOrnek.trim() || !yeniCeviri.trim() || !yeniAciklama.trim() || yeniGramerKuralId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/ornekler", {
        ispanyolcaOrnek: yeniIspanyolcaOrnek,
        ceviri: yeniCeviri,
        aciklama: yeniAciklama,
        gramerKuralId: Number(yeniGramerKuralId),
      });

      resetForm();
      await fetchOrnekler();
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Örnek sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu örneği silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/ornekler/${id}`);
      await fetchOrnekler();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(ornek: Ornek) {
    setDuzenlenecek(ornek);
    setYeniIspanyolcaOrnek(ornek.ispanyolcaOrnek);
    setYeniCeviri(ornek.ceviri);
    setYeniAciklama(ornek.aciklama);
    setYeniGramerKuralId(ornek.gramerKuralId);
    setError("");
  }

  // Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniIspanyolcaOrnek.trim() || !yeniCeviri.trim() || !yeniAciklama.trim() || yeniGramerKuralId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/ornekler/${duzenlenecek.id}`, {
        ispanyolcaOrnek: yeniIspanyolcaOrnek,
        ceviri: yeniCeviri,
        aciklama: yeniAciklama,
        gramerKuralId: Number(yeniGramerKuralId),
      });

      resetForm();
      await fetchOrnekler();
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      setError("Güncelleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Formu sıfırla
  function resetForm() {
    setDuzenlenecek(null);
    setYeniIspanyolcaOrnek("");
    setYeniCeviri("");
    setYeniAciklama("");
    setYeniGramerKuralId("");
    setError("");
  }

  if (loading && ornekler.length === 0) {
    return (
      <div className="ornek-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ornek-container">
      {/* Header */}
      <div className="ornek-header">
        <h1 className="ornek-title">Örnek Yönetimi</h1>
        <p className="ornek-subtitle">
          İspanyolca örnek cümleleri ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="ornek-form-container">
        <h2 className="ornek-form-title">
          {duzenlenecek ? "📝 Örnek Düzenle" : "➕ Yeni Örnek Ekle"}
        </h2>
        
        <div className="ornek-form-grid">
          <div className="form-group">
            <label className="form-label">İspanyolca Örnek *</label>
            <input
              type="text"
              placeholder="İspanyolca örnek cümleyi girin"
              value={yeniIspanyolcaOrnek}
              onChange={(e) => setYeniIspanyolcaOrnek(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Türkçe Çeviri *</label>
            <input
              type="text"
              placeholder="Türkçe çeviriyi girin"
              value={yeniCeviri}
              onChange={(e) => setYeniCeviri(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gramer Kuralı *</label>
            <select
              value={yeniGramerKuralId}
              onChange={(e) => setYeniGramerKuralId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Gramer Kuralı Seçin</option>
              {gramerKurallar.map((kural) => (
                <option key={kural.id} value={kural.id}>
                  {kural.kuralBaslik}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group ornek-form-full">
            <label className="form-label">Açıklama *</label>
            <textarea
              placeholder="Örnek ile ilgili açıklama ve notları girin..."
              value={yeniAciklama}
              onChange={(e) => setYeniAciklama(e.target.value)}
              className="form-textarea"
              disabled={loading}
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          {duzenlenecek ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Güncelleniyor..." : "✅ Güncelle"}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!yeniIspanyolcaOrnek || !yeniCeviri || !yeniAciklama || yeniGramerKuralId === "" || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Örnek Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="ornek-form-container">
        <h2 className="ornek-form-title">📋 Mevcut Örnekler</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : ornekler.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Henüz örnek bulunmuyor</h3>
            <p>İlk örneğinizi eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <CrudTable
            data={tableData}
            onEdit={(item) => {
              const originalOrnek = ornekler.find(o => o.id === item.id);
              if (originalOrnek) {
                startEdit(originalOrnek);
              }
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}