import { useEffect, useState } from "react";
import CrudTable from "../Dashboard/CrudTable";
import "./MetinPage.css";

import {
  type Metin,
  type MetinTema,
  type Tema,
  metinService,
  metinTemaLookupService,
  temaLookupService,
} from "../../../services/admin/Metin.service";

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
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniIcerik, setYeniIcerik] = useState("");
  const [yeniCeviri, setYeniCeviri] = useState("");
  const [yeniZorluk, setYeniZorluk] = useState("Kolay");
  const [yeniMetinTemaId, setYeniMetinTemaId] = useState<number | "">("");

  const [duzenlenecek, setDuzenlenecek] = useState<Metin | null>(null);

  // ⭐ Metin + MetinTema + Tema verilerini yükle
  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [metinRes, metinTemaRes, temaRes] = await Promise.all([
        metinService.getAll(),
        metinTemaLookupService.getAll(),
        temaLookupService.getAll(),
      ]);

      setMetinler(metinRes.data);
      setMetinTemalari(metinTemaRes.data);
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

  // ⭐ Tema başlığını bul
  const getTemaBaslik = (metinTemaId: number) => {
    const mTema = metinTemalari.find(mt => mt.id === metinTemaId);
    if (!mTema) return "Tema bulunamadı";

    const anaTema = temalar.find(t => t.id === mTema.temaId);
    return anaTema ? anaTema.baslik : "Başlık yok";
  };

  // ⭐ Tablo görünümü
  const tabloData: TableRow[] = metinler.map((metin) => ({
    id: metin.id,
    icerik:
      metin.icerik.length > 100
        ? metin.icerik.substring(0, 100) + "..."
        : metin.icerik,
    ceviri:
      metin.ceviri.length > 100
        ? metin.ceviri.substring(0, 100) + "..."
        : metin.ceviri,
    zorluk: metin.zorluk,
    tema: getTemaBaslik(metin.metinTemaId),
  }));

  // Yeni metin ekle
  async function handleAdd() {
    if (!yeniIcerik.trim() || !yeniCeviri.trim() || yeniMetinTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    try {
      await metinService.add({
        icerik: yeniIcerik,
        ceviri: yeniCeviri,
        zorluk: yeniZorluk,
        metinTemaId: Number(yeniMetinTemaId),
      });

      resetForm();
      await fetchAll();
    } catch {
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
      await metinService.delete(id);
      await fetchAll();
    } catch {
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
  }

  // Güncelle
  async function handleUpdate() {
    if (!duzenlenecek) return;

    if (!yeniIcerik.trim() || !yeniCeviri.trim() || yeniMetinTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    try {
      await metinService.update(duzenlenecek.id, {
        icerik: yeniIcerik,
        ceviri: yeniCeviri,
        zorluk: yeniZorluk,
        metinTemaId: Number(yeniMetinTemaId),
      });

      resetForm();
      await fetchAll();
    } catch {
      setError("Güncelleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setDuzenlenecek(null);
    setYeniIcerik("");
    setYeniCeviri("");
    setYeniZorluk("Kolay");
    setYeniMetinTemaId("");
    setError("");
  }

  return (
    <div className="metin-container">
      {loading && (
      <div className="loading-overlay">
        Yükleniyor...
      </div>
    )}
      <div className="metin-header">
        <h1 className="metin-title">Metin Yönetimi</h1>
        <p className="metin-subtitle">Metinleri ekleyin, düzenleyin ve yönetin</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* FORM */}
      <div className="metin-form-container">
        <h2 className="metin-form-title">
          {duzenlenecek ? "📝 Metni Düzenle" : "➕ Yeni Metin Ekle"}
        </h2>

        <div className="metin-form-grid">
          <div className="form-group">
            <label className="form-label">Zorluk Seviyesi *</label>
            <select
              value={yeniZorluk}
              onChange={(e) => setYeniZorluk(e.target.value)}
              className="form-select"
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
            >
              <option value="">Metin Teması Seçin</option>
              {metinTemalari.map((mt) => {
                const tema = temalar.find(t => t.id === mt.temaId);
                return (
                  <option key={mt.id} value={mt.id}>
                    {tema ? tema.baslik : "Başlık yok"}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group metin-form-full">
            <label className="form-label">İspanyolca Metin *</label>
            <textarea
              value={yeniIcerik}
              onChange={(e) => setYeniIcerik(e.target.value)}
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-group metin-form-full">
            <label className="form-label">Türkçe Çeviri *</label>
            <textarea
              value={yeniCeviri}
              onChange={(e) => setYeniCeviri(e.target.value)}
              className="form-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          {duzenlenecek ? (
            <>
              <button onClick={handleUpdate} className="btn btn-primary">
                Güncelle
              </button>
              <button onClick={resetForm} className="btn btn-secondary">
                İptal
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!yeniIcerik || !yeniCeviri || yeniMetinTemaId === ""}
              className="btn btn-success"
            >
              ➕ Yeni Metin Ekle
            </button>
          )}
        </div>
      </div>

      {/* TABLO */}
      <div className="metin-form-container">
        <h2 className="metin-form-title">📋 Mevcut Metinler</h2>

        <CrudTable
          data={tabloData}
          onEdit={(item) => {
            const original = metinler.find(m => m.id === item.id);
            if (original) startEdit(original);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
