import { useEffect, useState, type JSX } from "react";
import { temaService, type Tema } from "../../../services/admin/Tema.service";
import CrudTable from "../Dashboard/CrudTable";
import "./TemaPage.css";

interface TableRow {
  id: number;
  baslik: string;
  kapakResmi: string;
  resimOnizlemeleri: JSX.Element;
}

export default function TemaPage() {
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [yeniBaslik, setYeniBaslik] = useState("");
  const [duzenlenecek, setDuzenlenecek] = useState<Tema | null>(null);
  const [seciliTema, setSeciliTema] = useState<Tema | null>(null);

  // Kapak resmi yükleme state
  const [kapakResmi, setKapakResmi] = useState<File | null>(null);
  const [detayResimler, setDetayResimler] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Temaları yükle
  async function fetchTemalar() {
    setLoading(true);
    setError("");
    try {
      const res = await temaService.getAll();
      setTemalar(res.data);
    } catch (err) {
      console.error("Temalar yüklenemedi:", err);
      setError("Temalar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemalar();
  }, []);

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setDetayResimler(prev => [...prev, ...imageFiles]);
      setSuccess(`${imageFiles.length} resim dosyası eklendi!`);
    }
  };

  // Tablo için düzenlenmiş data oluştur
  const tabloData: TableRow[] = temalar.map(tema => {
    // Resim önizlemelerini oluştur
    const resimOnizlemeleri = (
      <div className="table-image-previews">
        {/* Kapak resmi */}
        {tema.kapakResmiUrl && (
          <img 
            src={tema.kapakResmiUrl} 
            alt="Kapak" 
            className="table-image-small"
            title="Kapak Resmi"
          />
        )}
        
        {/* Detay resimleri (ilk 3 tanesi) */}
        {tema.detayResimUrls?.slice(0, 3).map((url, index) => (
          <img 
            key={index}
            src={url} 
            alt={`Detay ${index + 1}`} 
            className="table-image-small"
            title={`Detay Resim ${index + 1}`}
          />
        ))}
        
        {/* Daha fazla resim varsa sayı göster */}
        {tema.detayResimUrls && tema.detayResimUrls.length > 3 && (
          <div className="table-image-placeholder" title={`+${tema.detayResimUrls.length - 3} daha`}>
            +{tema.detayResimUrls.length - 3}
          </div>
        )}
        
        {/* Hiç resim yoksa */}
        {!tema.kapakResmiUrl && (!tema.detayResimUrls || tema.detayResimUrls.length === 0) && (
          <div className="table-image-placeholder">
            ❌
          </div>
        )}
      </div>
    );

    return {
      id: tema.id,
      baslik: tema.baslik,
      kapakResmi: tema.kapakResmiUrl ? "✅ Var" : "❌ Yok",
      resimOnizlemeleri
    };
  });

  // Yeni tema ekle
  async function handleAdd() {
    if (!yeniBaslik.trim()) {
      setError("Lütfen tema başlığını girin!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await temaService.add({
        baslik: yeniBaslik,
      });

      resetForm();
      await fetchTemalar();
      setSuccess("Tema başarıyla eklendi!");
    } catch (err) {
      console.error("Ekleme hatası:", err);
      setError("Ekleme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Tema sil
  async function handleDelete(id: number) {
    if (!window.confirm("Bu temayı ve tüm resimlerini silmek istediğinizden emin misiniz?")) return;

    setLoading(true);
    try {
      await temaService.delete(id);
      await fetchTemalar();
      setSeciliTema(null);
      setSuccess("Tema ve tüm resimleri başarıyla silindi!");
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Silme işlemi başarısız!");
    } finally {
      setLoading(false);
    }
  }

  // Kapak resmi yükle
  async function handleKapakResmiYukle() {
    if (!seciliTema || !kapakResmi) {
      setError("Lütfen bir tema seçin ve kapak resmi yükleyin!");
      return;
    }

    setUploadLoading(true);
    setError("");
    try {
      const res = await temaService.uploadCover(seciliTema.id, kapakResmi);

      // Güncellenmiş temayı state'e ekle
      const guncellenmisTemalar = temalar.map(t => 
        t.id === seciliTema.id ? res.data : t
      );
      setTemalar(guncellenmisTemalar);
      setSeciliTema(res.data);
      setKapakResmi(null);
      setSuccess("Kapak resmi başarıyla yüklendi!");
    } catch (err) {
      console.error("Kapak resmi yükleme hatası:", err);
      setError("Kapak resmi yüklenirken bir hata oluştu!");
    } finally {
      setUploadLoading(false);
    }
  }

  // Detay resimleri yükle
  async function handleDetayResimleriYukle() {
    if (!seciliTema || detayResimler.length === 0) {
      setError("Lütfen bir tema seçin ve detay resimleri yükleyin!");
      return;
    }

    setUploadLoading(true);
    setError("");
    try {
      const res = await temaService.uploadDetails(seciliTema.id, detayResimler);

      // Güncellenmiş temayı state'e ekle
      const guncellenmisTemalar = temalar.map(t => 
        t.id === seciliTema.id ? res.data : t
      );
      setTemalar(guncellenmisTemalar);
      setSeciliTema(res.data);
      setDetayResimler([]);
      setSuccess("Detay resimleri başarıyla yüklendi!");
    } catch (err) {
      console.error("Detay resim yükleme hatası:", err);
      setError("Detay resimleri yüklenirken bir hata oluştu!");
    } finally {
      setUploadLoading(false);
    }
  }

  // Kapak resmini sil
  async function handleKapakResmiSil() {
    if (!seciliTema) return;

    setUploadLoading(true);
    try {
      const res = await temaService.deleteCover(seciliTema.id);

      const guncellenmisTemalar = temalar.map(t => 
        t.id === seciliTema.id ? res.data : t
      );
      setTemalar(guncellenmisTemalar);
      setSeciliTema(res.data);
      setSuccess("Kapak resmi başarıyla silindi!");
    } catch (err) {
      console.error("Kapak resmi silme hatası:", err);
      setError("Kapak resmi silinirken bir hata oluştu!");
    } finally {
      setUploadLoading(false);
    }
  }

  // Detay resmini sil
  async function handleDetayResimSil(resimUrl: string) {
    if (!seciliTema) return;

    setUploadLoading(true);
    try {
      const res = await temaService.deleteDetail(seciliTema.id, resimUrl);

      const guncellenmisTemalar = temalar.map(t => 
        t.id === seciliTema.id ? res.data : t
      );
      setTemalar(guncellenmisTemalar);
      setSeciliTema(res.data);
      setSuccess("Resim başarıyla silindi!");
    } catch (err) {
      console.error("Resim silme hatası:", err);
      setError("Resim silinirken bir hata oluştu!");
    } finally {
      setUploadLoading(false);
    }
  }

  // Formu sıfırla
  function resetForm() {
    setDuzenlenecek(null);
    setYeniBaslik("");
    setError("");
  }

  // Tema seç
  function temaSec(tema: Tema) {
    setSeciliTema(tema);
    setError("");
    setSuccess("");
  }

  // Seçili dosyaları temizle
  function dosyalariTemizle() {
    setKapakResmi(null);
    setDetayResimler([]);
  }

  if (loading && temalar.length === 0) {
    return (
      <div className="tema-container">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner" style={{ borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
          <span className="ml-3 text-lg">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tema-container">
      {/* Header */}
      <div className="tema-header">
        <h1 className="tema-title">Tema Yönetimi</h1>
        <p className="tema-subtitle">
          Temaları ekleyin, düzenleyin ve resim yönetimi yapın
        </p>
      </div>

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Tema Ekleme Formu */}
      <div className="tema-form-container">
        <h2 className="tema-form-title">
          {duzenlenecek ? "📝 Tema Düzenle" : "➕ Yeni Tema Ekle"}
        </h2>
        
        <div className="tema-form-grid">
          <div className="form-group">
            <label className="form-label">Tema Başlığı *</label>
            <input
              type="text"
              placeholder="Tema başlığını girin"
              value={yeniBaslik}
              onChange={(e) => setYeniBaslik(e.target.value)}
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          {duzenlenecek ? (
            <>
              <button
                onClick={() => {}}
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
              disabled={!yeniBaslik || loading}
              className="btn btn-success"
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Ekleniyor..." : "➕ Yeni Tema Ekle"}
            </button>
          )}
        </div>
      </div>

      {/* Resim Yükleme Bölümü */}
      {seciliTema && (
        <div className="tema-form-container">
          <h2 className="tema-form-title">
            🖼️ "{seciliTema.baslik}" Teması - Resim Yönetimi
          </h2>

          {/* Kapak Resmi */}
          <div className="file-upload-section">
            <h3 className="file-upload-title">📸 Kapak Resmi</h3>
            {seciliTema.kapakResmiUrl && (
              <div className="cover-section">
                <div className="cover-image-container">
                  <img 
                    src={seciliTema.kapakResmiUrl} 
                    alt="Kapak resmi" 
                    className="cover-image"
                  />
                  <div className="cover-actions">
                    <button
                      onClick={handleKapakResmiSil}
                      disabled={uploadLoading}
                      className="btn btn-danger"
                    >
                      {uploadLoading && <span className="loading-spinner"></span>}
                      🗑️ Kapak Resmini Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setKapakResmi(e.target.files?.[0] || null)}
                className="file-input"
              />
              <div className="file-info">
                Kapak resmi için tek bir resim seçin (JPG, PNG, GIF)
              </div>
            </div>
            <button
              onClick={handleKapakResmiYukle}
              disabled={!kapakResmi || uploadLoading}
              className="upload-button"
            >
              {uploadLoading && <span className="loading-spinner"></span>}
              📤 Kapak Resmi Yükle
            </button>
          </div>

          {/* Detay Resimleri */}
          <div className="file-upload-section">
            <h3 className="file-upload-title">🖼️ Detay Resimleri</h3>
            
            {/* Drag & Drop Alanı */}
            <div 
              className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('detail-images')?.click()}
            >
              <div className="drag-drop-text">📁 Resimleri buraya sürükleyin veya tıklayın</div>
              <div className="drag-drop-subtext">
                JPG, PNG, GIF formatlarında birden fazla resim yükleyebilirsiniz
              </div>
            </div>

            <input
              id="detail-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setDetayResimler(Array.from(e.target.files || []))}
              className="file-input"
              style={{ display: 'none' }}
            />

            {/* Seçilen dosyalar */}
            {detayResimler.length > 0 && (
              <div className="file-info">
                ✅ {detayResimler.length} resim seçildi:{" "}
                {detayResimler.map((file, index) => (
                  <span key={index} style={{ marginRight: '8px', background: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>
                    {file.name}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleDetayResimleriYukle}
                disabled={detayResimler.length === 0 || uploadLoading}
                className="upload-button"
              >
                {uploadLoading && <span className="loading-spinner"></span>}
                📤 Detay Resimleri Yükle ({detayResimler.length})
              </button>
              
              {detayResimler.length > 0 && (
                <button
                  onClick={dosyalariTemizle}
                  className="btn btn-secondary"
                >
                  🗑️ Seçimleri Temizle
                </button>
              )}
            </div>

            {/* Detay Resim Galerisi */}
            {seciliTema.detayResimUrls && seciliTema.detayResimUrls.length > 0 && (
              <>
                <h4 style={{ marginTop: '25px', marginBottom: '15px', color: '#495057' }}>
                  📋 Mevcut Detay Resimleri ({seciliTema.detayResimUrls.length})
                </h4>
                <div className="image-gallery">
                  {seciliTema.detayResimUrls.map((url, index) => (
                    <div key={index} className="image-item">
                      <img src={url} alt={`Detay ${index + 1}`} className="image-preview" loading="lazy" />
                      <div className="image-actions">
                        <button
                          onClick={() => handleDetayResimSil(url)}
                          className="delete-image-btn"
                          title="Resmi Sil"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Temalar Listesi */}
      <div className="tema-form-container">
        <h2 className="tema-form-title">📋 Mevcut Temalar</h2>
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" style={{ margin: '20px auto', borderColor: "#667eea", borderTopColor: 'transparent' }}></div>
            <p>Yükleniyor...</p>
          </div>
        ) : temalar.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎨</div>
            <h3>Henüz tema bulunmuyor</h3>
            <p>İlk temanızı eklemek için yukarıdaki formu kullanın.</p>
          </div>
        ) : (
          <div className="table-responsive">
          <CrudTable
            data={tabloData}
            onEdit={(item) => {
              const originalTema = temalar.find(t => t.id === item.id);
              if (originalTema) {
                temaSec(originalTema);
                // Sayfayı resim yükleme bölümüne kaydır
                setTimeout(() => {
                  document.getElementById('resim-yukleme')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            onDelete={handleDelete}
          /> </div>
        )}
      </div>

      {/* Anchor for scrolling */}
      <div id="resim-yukleme"></div>
    </div>
  );
}