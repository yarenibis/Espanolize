import { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import CrudTable from "../Dashboard/CrudTable";
import "./KelimeTemaPage.css";

interface KelimeTema {
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

export default function KelimeTemaPage() {
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<KelimeTema | null>(null);

  // Kelime temalarını yükle
  async function fetchKelimeTemalari() {
    try {
      const res = await api.get("/admin/kelime-temalari");
      setKelimeTemalari(res.data);
    } catch (err) {
      console.error("Kelime temaları yüklenemedi:", err);
      setError("Kelime temaları yüklenirken bir hata oluştu.");
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
        await Promise.all([fetchKelimeTemalari(), fetchTemalar()]);
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
  const tableData: TableRow[] = kelimeTemalari.map(tema => ({
    id: tema.id,
    aciklama: tema.aciklama.length > 100 ? tema.aciklama.substring(0, 100) + "..." : tema.aciklama,
    temaBaslik: getTemaBaslik(tema.temaId)
  }));

  // Yeni kelime teması ekle
  async function handleAdd() {
    if (!yeniAciklama.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/kelime-temalari", {
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchKelimeTemalari();
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Kelime teması sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu kelime temasını silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/kelime-temalari/${id}`);
      await fetchKelimeTemalari();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(tema: KelimeTema) {
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
      await api.put(`/admin/kelime-temalari/${duzenlenecek.id}`, {
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchKelimeTemalari();
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

  if (loading && kelimeTemalari.length === 0) {
    return (
      <div className="kelime-tema-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="kelime-tema-container">
      {/* Header */}
      <div className="kelime-tema-header">
        <h1 className="kelime-tema-title">Kelime Tema Yönetimi</h1>
        <p className="kelime-tema-subtitle">
          Kelime temalarını ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="kelime-tema-form-container">
        <h2 className="kelime-tema-form-title">
          {duzenlenecek ? "📝 Kelime Teması Düzenle" : "➕ Yeni Kelime Teması Ekle"}
        </h2>
        
        <div className="kelime-tema-form-grid">
          <div className="form-group kelime-tema-form-full">
            <label className="form-label">Açıklama *</label>
            <textarea
              placeholder="Kelime teması açıklamasını girin (örn: 'Ev eşyaları', 'Yiyecekler', 'Hayvanlar' vb.)"
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
      <div className="kelime-tema-form-container">
        <h2 className="kelime-tema-form-title">📋 Mevcut Kelime Temaları</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : kelimeTemalari.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <h3>Henüz kelime teması bulunmuyor</h3>
            <p>İlk kelime temanızı eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <CrudTable
            data={tableData}
            onEdit={(item) => {
              const originalTema = kelimeTemalari.find(t => t.id === item.id);
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