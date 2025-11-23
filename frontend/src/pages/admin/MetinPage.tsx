import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import CrudTable from "../../components/adminDashboard/CrudTable";
import "./MetinPage.css";

interface Metin {
  id: number;
  icerik: string;
  ceviri: string;
  zorluk: string;
  metinTemaId: number;
}

interface MetinTema {
  id: number;
  aciklama: string;
}

interface TableRow {
  id: number;
  icerik: string;
  ceviri: string;
  zorluk: string;
  tema: string;
}

export default function MetinPage() {
  const [metinler, setMetinler] = useState<Metin[]>([]);
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniIcerik, setYeniIcerik] = useState("");
  const [yeniCeviri, setYeniCeviri] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("Kolay");
  const [yeniMetinTemaId, setYeniMetinTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Metin | null>(null);

  // Metinleri ve temaları yükle
  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [metinRes, temaRes] = await Promise.all([
        api.get("/admin/metinler"),
        api.get("/admin/metin-temalari")
      ]);
      setMetinler(metinRes.data);
      setMetinTemalari(temaRes.data);
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // Tema ID'sine göre tema açıklamasını bul
  const getTemaAciklama = (metinTemaId: number) => {
    const tema = metinTemalari.find(t => t.id === metinTemaId);
    return tema ? tema.aciklama : `Tema ID: ${metinTemaId}`;
  };

  // Zorluk seviyesine göre CSS class'ını döndür
  const getZorlukClass = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case "kolay": return "zorluk-badge zorluk-kolay";
      case "orta": return "zorluk-badge zorluk-orta";
      case "zor": return "zorluk-badge zorluk-zor";
      default: return "zorluk-badge zorluk-orta";
    }
  };

  // Tablo için düzenlenmiş data oluştur
  const tabloData: TableRow[] = metinler.map((metin) => ({
    id: metin.id,
    icerik: metin.icerik.length > 100 ? metin.icerik.substring(0, 100) + "..." : metin.icerik,
    ceviri: metin.ceviri.length > 100 ? metin.ceviri.substring(0, 100) + "..." : metin.ceviri,
    zorluk: metin.zorluk,
    tema: getTemaAciklama(metin.metinTemaId)
  }));

  // Yeni metin ekle
  async function handleAdd() {
    if (!yeniIcerik.trim() || !yeniCeviri.trim() || yeniMetinTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/metinler", {
        icerik: yeniIcerik,
        ceviri: yeniCeviri,
        zorluk: yeniZorluk,
        metinTemaId: Number(yeniMetinTemaId),
      });

      resetForm();
      await fetchAll();
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Metin sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu metni silmek istediğinizden emin misiniz?")) return;

    setLoading(true);
    try {
      await api.delete(`/admin/metinler/${id}`);
      await fetchAll();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(metin: Metin) {
    setDuzenlenecek(metin);
    setYeniIcerik(metin.icerik);
    setYeniCeviri(metin.ceviri);
    setYeniZorluk(metin.zorluk);
    setYeniMetinTemaId(metin.metinTemaId);
    setError("");
  }

  // Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniIcerik.trim() || !yeniCeviri.trim() || yeniMetinTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/metinler/${duzenlenecek.id}`, {
        icerik: yeniIcerik,
        ceviri: yeniCeviri,
        zorluk: yeniZorluk,
        metinTemaId: Number(yeniMetinTemaId),
      });

      resetForm();
      await fetchAll();
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
    setYeniIcerik("");
    setYeniCeviri("");
    setYeniZorluk("Kolay");
    setYeniMetinTemaId("");
    setError("");
  }

  if (loading && metinler.length === 0) {
    return (
      <div className="metin-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="metin-container">
      {/* Header */}
      <div className="metin-header">
        <h1 className="metin-title">Metin Yönetimi</h1>
        <p className="metin-subtitle">
          İspanyolca metinleri ve çevirilerini ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="metin-form-container">
        <h2 className="metin-form-title">
          {duzenlenecek ? "📝 Metin Düzenle" : "➕ Yeni Metin Ekle"}
        </h2>
        
        <div className="metin-form-grid">
          <div className="form-group">
            <label className="form-label">Zorluk Seviyesi *</label>
            <select
              value={yeniZorluk}
              onChange={(e) => setYeniZorluk(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="Kolay">Kolay</option>
              <option value="Orta">Orta</option>
              <option value="Zor">Zor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Metin Teması *</label>
            <select
              value={yeniMetinTemaId}
              onChange={(e) => setYeniMetinTemaId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Metin Teması Seçin</option>
              {metinTemalari.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.aciklama}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group metin-form-full">
            <label className="form-label">İspanyolca Metin *</label>
            <textarea
              placeholder="İspanyolca metni girin..."
              value={yeniIcerik}
              onChange={(e) => setYeniIcerik(e.target.value)}
              className="form-textarea ispanyolca-metin"
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-group metin-form-full">
            <label className="form-label">Türkçe Çeviri *</label>
            <textarea
              placeholder="Türkçe çeviriyi girin..."
              value={yeniCeviri}
              onChange={(e) => setYeniCeviri(e.target.value)}
              className="form-textarea turkce-metin"
              disabled={loading}
              rows={4}
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
              disabled={!yeniIcerik || !yeniCeviri || yeniMetinTemaId === "" || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Metin Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="metin-form-container">
        <h2 className="metin-form-title">📋 Mevcut Metinler</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : metinler.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>Henüz metin bulunmuyor</h3>
            <p>İlk metninizi eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <CrudTable
            data={tabloData}
            onEdit={(item) => {
              const originalMetin = metinler.find(m => m.id === item.id);
              if (originalMetin) {
                startEdit(originalMetin);
              }
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}