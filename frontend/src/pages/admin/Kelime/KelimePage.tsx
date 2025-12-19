import { useEffect, useState } from "react";
import CrudTable from "../Dashboard/CrudTable";
import "./KelimePage.css";

import {
  kelimeService,
  type KelimeDto
} from "../../../services/admin/Kelime.service";

import {
  kelimeTemaService,
  type KelimeTemaDto,
  type TemaDto
} from "../../../services/admin/KelimeTema.service";

interface TableRow {
  id: number;
  ispanyolca: string;
  turkce: string;
  tema: string;
}

export default function KelimePage() {
  const [kelimeler, setKelimeler] = useState<KelimeDto[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTemaDto[]>([]);
  const [temalar, setTemalar] = useState<TemaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yeniIspanyolca, setYeniIspanyolca] = useState("");
  const [yeniTurkce, setYeniTurkce] = useState("");
  const [yeniTemaId, setYeniTemaId] = useState<number | "">("");
  const [duzenlenecek, setDuzenlenecek] = useState<KelimeDto | null>(null);

  async function fetchAll() {
    setLoading(true);
    try {
      const [kelimeRes, kelimeTemaRes, temaRes] = await Promise.all([
        kelimeService.getAll(),
        kelimeTemaService.getAllKelimeTemalari(),
        kelimeTemaService.getAllTemalar()
      ]);

      setKelimeler(kelimeRes.data);
      setKelimeTemalari(kelimeTemaRes.data);
      setTemalar(temaRes.data);
    } catch {
      setError("Veriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const getTemaBaslik = (kelimeTemasiId: number) => {
    const kt = kelimeTemalari.find(k => k.id === kelimeTemasiId);
    const tema = temalar.find(t => t.id === kt?.temaId);
    return tema ? tema.baslik : "Tema bulunamadı";
  };

  const tableData: TableRow[] = kelimeler.map(k => ({
    id: k.id,
    ispanyolca: k.ispanyolca,
    turkce: k.turkce,
    tema: getTemaBaslik(k.kelimeTemasiId)
  }));

  async function handleAdd() {
    if (!yeniIspanyolca || !yeniTurkce || yeniTemaId === "") {
      setError("Tüm alanları doldurun!");
      return;
    }

    setLoading(true);
    try {
      await kelimeService.create({
        ispanyolca: yeniIspanyolca,
        turkce: yeniTurkce,
        kelimeTemasiId: Number(yeniTemaId)
      });

      resetForm();
      await fetchAll();
    } catch {
      setError("Ekleme başarısız!");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!duzenlenecek) return;

    setLoading(true);
    try {
      await kelimeService.update(duzenlenecek.id, {
        ispanyolca: yeniIspanyolca,
        turkce: yeniTurkce,
        kelimeTemasiId: Number(yeniTemaId)
      });

      resetForm();
      await fetchAll();
    } catch {
      setError("Güncelleme başarısız!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Kelime silinsin mi?")) return;

    await kelimeService.delete(id);
    await fetchAll();
  }

  function startEdit(k: KelimeDto) {
    setDuzenlenecek(k);
    setYeniIspanyolca(k.ispanyolca);
    setYeniTurkce(k.turkce);
    setYeniTemaId(k.kelimeTemasiId);
  }

  function resetForm() {
    setDuzenlenecek(null);
    setYeniIspanyolca("");
    setYeniTurkce("");
    setYeniTemaId("");
  }

  return (
    <div className="kelime-container">
      <div className="kelime-header">
        <h1 className="kelime-title">Kelime Yönetimi</h1>
        <p className="kelime-subtitle">
          İspanyolca - Türkçe kelimeleri yönetin
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="kelime-form-container">
        <h2 className="kelime-form-title">
          {duzenlenecek ? "📝 Kelime Düzenle" : "➕ Yeni Kelime Ekle"}
        </h2>

        <div className="kelime-form-grid">
          <input
            className="form-input"
            value={yeniIspanyolca}
            onChange={e => setYeniIspanyolca(e.target.value)}
            placeholder="İspanyolca"
          />

          <input
            className="form-input"
            value={yeniTurkce}
            onChange={e => setYeniTurkce(e.target.value)}
            placeholder="Türkçe"
          />

          <select
            className="form-select"
            value={yeniTemaId}
            onChange={e => setYeniTemaId(Number(e.target.value))}
          >
            <option value="">Kelime Teması Seçin</option>
            {kelimeTemalari.map(kt => {
              const tema = temalar.find(t => t.id === kt.temaId);
              return (
                <option key={kt.id} value={kt.id}>
                  {tema?.baslik ?? "Başlık yok"}
                </option>
              );
            })}
          </select>
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
              ➕ Yeni Kelime Ekle
            </button>
          )}
        </div>
      </div>

      <CrudTable
        data={tableData}
        onEdit={item => {
          const k = kelimeler.find(x => x.id === item.id);
          if (k) startEdit(k);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
