import { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import CrudTable from "../Dashboard/CrudTable";
import "./MetinTemaPage.css";

interface MetinTema {
  id: number;
  aciklama: string;
  temaId: number;
}

interface Tema {
  id: number;
  baslik: string;
}

interface TableRow {
  id: number;
  aciklama: string;
  temaBaslik: string;
}

export default function MetinTemaPage() {
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<MetinTema | null>(null);

  // Metin temalarını yükle
  async function fetchMetinTemalari() {
    try {
      const res = await api.get("/admin/metin-temalari");
      setMetinTemalari(res.data);
    } catch (err) {
      console.error("Metin temaları yüklenemedi:", err);
      setError("Metin temaları yüklenirken bir hata oluştu.");
    }
  }

  // Ana temaları yükle
  async function fetchTemalar() {
    try {
      const res = await api.get("/admin/tema");
      setTemalar(res.data);
    } catch (err) {
      console.error("Temalar yüklenemedi:", err);
      setError("Temalar yüklenirken bir hata oluştu.");
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([fetchMetinTemalari(), fetchTemalar()]);
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Tema ID'sine göre tema başlığını bul
  const getTemaBaslik = (temaId: number) => {
    const tema = temalar.find(t => t.id === temaId);
    return tema ? tema.baslik : `Tema ID: ${temaId}`;
  };

  // Tablo için düzenlenmiş data oluştur
  const tableData: TableRow[] = metinTemalari.map(tema => ({
    id: tema.id,
    aciklama: tema.aciklama.length > 100 ? tema.aciklama.substring(0, 100) + "..." : tema.aciklama,
    temaBaslik: getTemaBaslik(tema.temaId)
  }));

  // Yeni metin teması ekle
  async function handleAdd() {
    if (!yeniAciklama.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/metin-temalari", {
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchMetinTemalari();
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Metin teması sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu metin temasını silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/metin-temalari/${id}`);
      await fetchMetinTemalari();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(tema: MetinTema) {
    setDuzenlenecek(tema);
    setYeniAciklama(tema.aciklama);
    setYeniTemaId(tema.temaId);
    setError("");
  }

  // Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniAciklama.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/metin-temalari/${duzenlenecek.id}`, {
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchMetinTemalari();
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
    setYeniAciklama("");
    setYeniTemaId("");
    setError("");
  }

  if (loading && metinTemalari.length === 0) {
    return (
      <div className="metin-tema-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="metin-tema-container">
      {/* Header */}
      <div className="metin-tema-header">
        <h1 className="metin-tema-title">Metin Tema Yönetimi</h1>
        <p className="metin-tema-subtitle">
          Metin temalarını ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="metin-tema-form-container">
        <h2 className="metin-tema-form-title">
          {duzenlenecek ? "📝 Metin Teması Düzenle" : "➕ Yeni Metin Teması Ekle"}
        </h2>
        
        <div className="metin-tema-form-grid">
          <div className="form-group metin-tema-form-full">
            <label className="form-label">Açıklama *</label>
            <textarea
              placeholder="Metin teması açıklamasını girin (örn: 'Günlük Yaşam', 'Seyahat', 'Kültür' vb.)"
              value={yeniAciklama}
              onChange={(e) => setYeniAciklama(e.target.value)}
              className="form-textarea"
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ana Tema *</label>
            <select
              value={yeniTemaId}
              onChange={(e) => setYeniTemaId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Ana Tema Seçin</option>
              {temalar.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.baslik}
                </option>
              ))}
            </select>
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
              disabled={!yeniAciklama || yeniTemaId === "" || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Tema Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="metin-tema-form-container">
        <h2 className="metin-tema-form-title">📋 Mevcut Metin Temaları</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : metinTemalari.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>Henüz metin teması bulunmuyor</h3>
            <p>İlk metin temanızı eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <CrudTable
            data={tableData}
            onEdit={(item) => {
              const originalTema = metinTemalari.find(t => t.id === item.id);
              if (originalTema) {
                startEdit(originalTema);
              }
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}