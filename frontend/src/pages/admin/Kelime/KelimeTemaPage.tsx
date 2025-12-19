import { useEffect, useState } from "react";
import CrudTable from "../Dashboard/CrudTable";
import "./KelimeTemaPage.css";

import {
  kelimeTemaService,
  type KelimeTemaDto,
  type TemaDto
} from "../../../services/admin/KelimeTema.service";

interface TableRow {
  id: number;
  aciklama: string;
  temaBaslik: string;
}

export default function KelimeTemaPage() {
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTemaDto[]>([]);
  const [temalar, setTemalar] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniAciklama, setYeniAciklama] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<KelimeTemaDto | null>(null);

  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [kelimeTemaRes, temaRes] = await Promise.all([
        kelimeTemaService.getAllKelimeTemalari(),
        kelimeTemaService.getAllTemalar()
      ]);

      setKelimeTemalari(kelimeTemaRes.data);
      setTemalar(temaRes.data);
    } catch (err) {
      console.error(err);
      setError("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const getTemaBaslik = (temaId: number) => {
    const tema = temalar.find(t => t.id === temaId);
    return tema ? tema.baslik : `Tema ID: ${temaId}`;
  };

  const tableData: TableRow[] = kelimeTemalari.map(t => ({
    id: t.id,
    aciklama:
      t.aciklama.length > 100
        ? t.aciklama.substring(0, 100) + "..."
        : t.aciklama,
    temaBaslik: getTemaBaslik(t.temaId)
  }));

  async function handleAdd() {
    if (!yeniAciklama.trim() || yeniTemaId === "") {
      setError("Lütfen tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    try {
      await kelimeTemaService.createKelimeTema({
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId)
      });

      resetForm();
      await fetchAll();
    } catch {
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Bu kelime temasını silmek istiyor musunuz?")) return;

    setLoading(true);
    try {
      await kelimeTemaService.deleteKelimeTema(id);
      await fetchAll();
    } catch {
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(tema: KelimeTemaDto) {
    setDuzenlenecek(tema);
    setYeniAciklama(tema.aciklama);
    setYeniTemaId(tema.temaId);
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    setLoading(true);
    try {
      await kelimeTemaService.updateKelimeTema(duzenlenecek.id, {
        aciklama: yeniAciklama,
        temaId: Number(yeniTemaId)
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
    setYeniAciklama("");
    setYeniTemaId("");
    setError("");
  }

  return (
    <div className="kelime-tema-container">
      <div className="kelime-tema-header">
        <h1 className="kelime-tema-title">Kelime Tema Yönetimi</h1>
        <p className="kelime-tema-subtitle">
          Kelime temalarını ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="kelime-tema-form-container">
        <h2 className="kelime-tema-form-title">
          {duzenlenecek ? "📝 Kelime Teması Düzenle" : "➕ Yeni Kelime Teması Ekle"}
        </h2>

        <div className="kelime-tema-form-grid">
          <div className="form-group kelime-tema-form-full">
            <label className="form-label">Açıklama *</label>
            <textarea
              value={yeniAciklama}
              onChange={e => setYeniAciklama(e.target.value)}
              className="form-textarea"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ana Tema *</label>
            <select
              value={yeniTemaId}
              onChange={e => setYeniTemaId(Number(e.target.value))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Ana Tema Seçin</option>
              {temalar.map(t => (
                <option key={t.id} value={t.id}>
                  {t.baslik}
                </option>
              ))}
            </select>
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
            <button onClick={handleAdd} className="btn btn-success">
              ➕ Yeni Tema Ekle
            </button>
          )}
        </div>
      </div>

      <CrudTable
        data={tableData}
        onEdit={item => {
          const original = kelimeTemalari.find(k => k.id === item.id);
          if (original) startEdit(original);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
