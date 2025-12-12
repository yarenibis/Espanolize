import React, { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import CrudTable from "../Dashboard/CrudTable";
import "./KonuPage.css";

interface Konu {
  id: number;
  baslik: string;
  zorluk: string;
  calismaSuresi: number;
  aciklama: string;
  temaId: number;
}

interface Tema {
  id: number;
  baslik: string;
}

export default function KonuPage() {
  const [konular, setKonular] = useState<Konu[]>([]);
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("Kolay");
  const [yeniCalismaSuresi, setYeniCalismaSuresi] = useState<number | "">("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Konu | null>(null);

  // Temaları yükle
  async function getTemalar() {
    try {
      const res = await api.get("/admin/tema");
      setTemalar(res.data);
    } catch (err) {
      console.error("Temalar yüklenemedi:", err);
      setError("Temalar yüklenirken bir hata oluştu.");
    }
  }

  // Konuları yükle
  async function fetchKonular() {
    try {
      const res = await api.get("/admin/konular");
      setKonular(res.data);
    } catch (err) {
      console.error("Konular yüklenemedi:", err);
      setError("Konular yüklenirken bir hata oluştu.");
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([fetchKonular(), getTemalar()]);
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
  const tabloData = konular.map(konu => ({
    id: konu.id,
    baslik: konu.baslik,
    zorluk: konu.zorluk,
    calismaSuresi: konu.calismaSuresi,
    aciklama: konu.aciklama.length > 100 ? konu.aciklama.substring(0, 100) + "..." : konu.aciklama,
    tema: getTemaBaslik(konu.temaId)
  }));

  // Yeni konu ekle
  async function handleAdd() {
    if (!yeniBaslik.trim() || !yeniAciklama.trim() || yeniCalismaSuresi === "" || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/admin/konular", {
        baslik: yeniBaslik,
        zorluk: yeniZorluk,
        calismaSuresi: Number(yeniCalismaSuresi),
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchKonular();
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Konu sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu konuyu silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/konular/${id}`);
      await fetchKonular();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(konu: Konu) {
    setDuzenlenecek(konu);
    setYeniBaslik(konu.baslik);
    setYeniAciklama(konu.aciklama);
    setYeniCalismaSuresi(konu.calismaSuresi);
    setYeniZorluk(konu.zorluk);
    setYeniTemaId(konu.temaId);
    setError("");
  }

  // Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniBaslik.trim() || !yeniAciklama.trim() || yeniCalismaSuresi === "" || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.put(`/admin/konular/${duzenlenecek.id}`, {
        baslik: yeniBaslik,
        zorluk: yeniZorluk,
        calismaSuresi: Number(yeniCalismaSuresi),
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId),
      });

      resetForm();
      await fetchKonular();
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
    setYeniBaslik("");
    setYeniAciklama("");
    setYeniCalismaSuresi("");
    setYeniZorluk("Kolay");
    setYeniTemaId("");
    setError("");
  }

  if (loading && konular.length === 0) {
    return (
      <div className="konu-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="konu-container">
      {/* Header */}
      <div className="konu-header">
        <h1 className="konu-title">Konu Yönetimi</h1>
        <p className="konu-subtitle">
          Dil öğrenimi için konuları ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="konu-form-container">
        <h2 className="konu-form-title">
          {duzenlenecek ? "📝 Konu Düzenle" : "➕ Yeni Konu Ekle"}
        </h2>
        
        <div className="konu-form-grid">
          <div className="form-group">
            <label className="form-label">Konu Başlığı *</label>
            <input
              type="text"
              placeholder="Konu başlığını girin"
              value={yeniBaslik}
              onChange={(e) => setYeniBaslik(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

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
            <label className="form-label">Çalışma Süresi (dakika) *</label>
            <input
              type="number"
              placeholder="Örn: 30"
              value={yeniCalismaSuresi}
              onChange={(e) => setYeniCalismaSuresi(Number(e.target.value))}
              className="form-input"
              disabled={loading}
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tema *</label>
            <select
              value={yeniTemaId}
              onChange={(e) => setYeniTemaId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Tema Seçin</option>
              {temalar.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.baslik}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group konu-form-full">
            <label className="form-label">Açıklama *</label>
            <textarea
              placeholder="Konu açıklamasını detaylı bir şekilde girin..."
              value={yeniAciklama}
              onChange={(e) => setYeniAciklama(e.target.value)}
              className="form-textarea"
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
              disabled={!yeniBaslik || !yeniAciklama || yeniCalismaSuresi === "" || yeniTemaId === "" || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Konu Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Tablo */}
      <div className="konu-form-container">
        <h2 className="konu-form-title">📋 Mevcut Konular</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : konular.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>Henüz konu bulunmuyor</h3>
            <p>İlk konunuzu eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <div className="table-responsive">
          <CrudTable
            data={tabloData}
            onEdit={(item) => {
              const originalKonu = konular.find(k => k.id === item.id);
              if (originalKonu) {
                startEdit(originalKonu);
              }
            }}
            onDelete={handleDelete}
          /> </div>
        )}
      </div>
    </div>
  );
}