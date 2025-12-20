import { useEffect, useState } from "react";
import CrudTable from "../Dashboard/CrudTable";
import "./OrnekPage.css";

import {
  type Ornek,
  type GramerKural,
  ornekService,
  gramerKuralService,
} from "../../../services/admin/Ornek.service";

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

  /* =====================
     DATA FETCH
  ===================== */

  async function fetchGramerKurallar() {
    try {
      const res = await gramerKuralService.getAll();
      setGramerKurallar(res.data);
    } catch (err) {
      console.error(err);
      setError("Gramer kuralları yüklenirken hata oluştu.");
    }
  }

  async function fetchOrnekler() {
    try {
      const res = await ornekService.getAll();
      setOrnekler(res.data);
    } catch (err) {
      console.error(err);
      setError("Örnekler yüklenirken hata oluştu.");
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      await Promise.all([fetchGramerKurallar(), fetchOrnekler()]);
      setLoading(false);
    };
    load();
  }, []);

  /* =====================
     HELPERS
  ===================== */

  const getGramerBaslik = (id: number) => {
    const kural = gramerKurallar.find(k => k.id === id);
    return kural ? kural.kuralBaslik : `Kural ID: ${id}`;
  };

  const tableData = ornekler.map(o => ({
    id: o.id,
    ispanyolcaOrnek: o.ispanyolcaOrnek,
    ceviri: o.ceviri,
    aciklama: o.aciklama ?? "",
    kuralBaslik: getGramerBaslik(o.gramerKuralId),
  }));

  /* =====================
     CRUD
  ===================== */

  async function handleAdd() {
    if (!yeniIspanyolcaOrnek || !yeniCeviri || yeniGramerKuralId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    await ornekService.add({
      ispanyolcaOrnek: yeniIspanyolcaOrnek,
      ceviri: yeniCeviri,
      aciklama: yeniAciklama,
      gramerKuralId: Number(yeniGramerKuralId),
    });
    resetForm();
    await fetchOrnekler();
    setLoading(false);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    setLoading(true);
    await ornekService.update(duzenlenecek.id, {
      ispanyolcaOrnek: yeniIspanyolcaOrnek,
      ceviri: yeniCeviri,
      aciklama: yeniAciklama,
      gramerKuralId: Number(yeniGramerKuralId),
    });
    resetForm();
    await fetchOrnekler();
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await ornekService.delete(id);
    await fetchOrnekler();
    setLoading(false);
  }

  function startEdit(o: Ornek) {
    setDuzenlenecek(o);
    setYeniIspanyolcaOrnek(o.ispanyolcaOrnek);
    setYeniCeviri(o.ceviri);
    setYeniAciklama(o.aciklama ?? "");
    setYeniGramerKuralId(o.gramerKuralId);
  }

  function resetForm() {
    setDuzenlenecek(null);
    setYeniIspanyolcaOrnek("");
    setYeniCeviri("");
    setYeniAciklama("");
    setYeniGramerKuralId("");
    setError("");
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
          <div className="table-responsive">
          <CrudTable
            data={tableData}
            onEdit={(item) => {
              const originalOrnek = ornekler.find(o => o.id === item.id);
              if (originalOrnek) {
                startEdit(originalOrnek);
              }
            }}
            onDelete={handleDelete}
          /> </div>
        )}
      </div>
    </div>
  );
}