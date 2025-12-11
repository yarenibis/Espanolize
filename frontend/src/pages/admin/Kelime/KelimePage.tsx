import { useEffect, useState } from "react";
import api from "../../../services/ApiService";
import CrudTable from "../Dashboard/CrudTable";
import "./KelimePage.css";

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
  kelimeTemasiId: number;
}

interface KelimeTema {
  id: number;
  aciklama: string;
  temaId: number;
}

interface Tema {
  id: number;
  baslik: string;  // ⭐ Tema başlığı
}

interface TableRow {
  id: number;
  ispanyolca: string;
  turkce: string;
  tema: string;
}

export default function KelimePage() {
  const [kelimeler, setKelimeler] = useState<Kelime[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniIspanyolca, setYeniIspanyolca] = useState("");
  const [yeniTurkce, setYeniTurkce] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Kelime | null>(null);

  // Kelimeler + Kelime Temaları + Temalar yükleniyor
  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [kelimeRes, kelimeTemaRes, temaRes] = await Promise.all([
        api.get("/admin/kelimeler"),
        api.get("/admin/kelime-temalari"),
        api.get("/admin/tema")  // ⭐ Tema başlıkları buradan geliyor
      ]);

      setKelimeler(kelimeRes.data);
      setKelimeTemalari(kelimeTemaRes.data);
      setTemalar(temaRes.data);

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

  // ⭐ Tema ID → Tema Başlığı eşleştirme
  const getTemaBaslik = (kelimeTemasiId: number) => {
    const kelimeTema = kelimeTemalari.find(kt => kt.id === kelimeTemasiId);
    if (!kelimeTema) return "Tema bulunamadı";

    const anaTema = temalar.find(t => t.id === kelimeTema.temaId);
    return anaTema ? anaTema.baslik : "Başlık yok";
  };

  // Yeni kelime ekle
  async function handleAdd() {
    if (!yeniIspanyolca.trim() || !yeniTurkce.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/admin/kelimeler", {
        ispanyolca: yeniIspanyolca,
        turkce: yeniTurkce,
        kelimeTemasiId: Number(yeniTemaId),
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

  // Kelime sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu kelimeyi silmek istediğinizden emin misiniz?")) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/kelimeler/${id}`);
      await fetchAll();
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Düzenleme moduna geç
  function startEdit(kelime: Kelime) {
    setDuzenlenecek(kelime);
    setYeniIspanyolca(kelime.ispanyolca);
    setYeniTurkce(kelime.turkce);
    setYeniTemaId(kelime.kelimeTemasiId);
    setError("");
  }

  // Güncelleme işlemi
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniIspanyolca.trim() || !yeniTurkce.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/kelimeler/${duzenlenecek.id}`, {
        ispanyolca: yeniIspanyolca,
        turkce: yeniTurkce,
        kelimeTemasiId: Number(yeniTemaId),
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

  // Form sıfırla
  function resetForm() {
    setDuzenlenecek(null);
    setYeniIspanyolca("");
    setYeniTurkce("");
    setYeniTemaId("");
    setError("");
  }

  // ⭐ Tablo verisini oluştur
  const tabloData: TableRow[] = kelimeler.map((k) => ({
    id: k.id,
    ispanyolca: k.ispanyolca,
    turkce: k.turkce,
    tema: getTemaBaslik(k.kelimeTemasiId)
  }));

  if (loading && kelimeler.length === 0) {
    return (
      <div className="kelime-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="kelime-container">
      <div className="kelime-header">
        <h1 className="kelime-title">Kelime Yönetimi</h1>
        <p className="kelime-subtitle">
          İspanyolca-Türkçe kelimeleri ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ⭐ Form */}
      <div className="kelime-form-container">
        <h2 className="kelime-form-title">
          {duzenlenecek ? "📝 Kelime Düzenle" : "➕ Yeni Kelime Ekle"}
        </h2>
        
        <div className="kelime-form-grid">
          <div className="form-group">
            <label className="form-label">İspanyolca *</label>
            <input
              type="text"
              placeholder="İspanyolca kelimeyi girin"
              value={yeniIspanyolca}
              onChange={(e) => setYeniIspanyolca(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Türkçe *</label>
            <input
              type="text"
              placeholder="Türkçe karşılığını girin"
              value={yeniTurkce}
              onChange={(e) => setYeniTurkce(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* ⭐ Dropdown artık Tema Başlıklarını gösteriyor */}
          <div className="form-group">
            <label className="form-label">Kelime Teması *</label>
            <select
              value={yeniTemaId}
              onChange={(e) => setYeniTemaId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Kelime Teması Seçin</option>

              {kelimeTemalari.map((kt) => {
                const anaTema = temalar.find(t => t.id === kt.temaId);
                return (
                  <option key={kt.id} value={kt.id}>
                    {anaTema ? anaTema.baslik : "Başlık yok"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-actions">
          {duzenlenecek ? (
            <>
              <button onClick={handleUpdate} className="btn btn-primary">
                {loading ? "Güncelleniyor..." : "✅ Güncelle"}
              </button>
              <button onClick={resetForm} className="btn btn-secondary">
                İptal
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!yeniIspanyolca || !yeniTurkce || yeniTemaId === "" || loading}
              className="btn btn-success"
            >
              {loading ? "Ekleniyor..." : "➕ Yeni Kelime Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* ⭐ Tablo */}
      <div className="kelime-form-container">
        <h2 className="kelime-form-title">📋 Mevcut Kelimeler</h2>

        <CrudTable
          data={tabloData}
          onEdit={(item) => {
            const originalKelime = kelimeler.find(k => k.id === item.id);
            if (originalKelime) startEdit(originalKelime);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
