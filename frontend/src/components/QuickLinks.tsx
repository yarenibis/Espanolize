import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOutlined, ReadOutlined, FileTextOutlined, ClockCircleOutlined } from "@ant-design/icons";
import api from "../services/ApiService";
import "./QuickLinks.css";

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
}

interface KelimeTema {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
}

export default function QuickLinks() {
  const [gramerKonulari, setGramerKonulari] = useState<Konu[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = async () => {
    try {
      setLoading(true);
      
      // Paralel API çağrıları
      const [gramerRes, kelimeRes, metinRes] = await Promise.all([
        api.get("/konular?limit=3"),
        api.get("/kelimetemalari?limit=3"),
        api.get("/metinTema?limit=3")
      ]);

      // Verileri normalize et
      setGramerKonulari(normalizeKonular(gramerRes.data));
      setKelimeTemalari(normalizeKelimeTemalari(kelimeRes.data));
      setMetinTemalari(normalizeMetinTemalari(metinRes.data));

    } catch (error) {
      console.error("QuickLinks verileri yüklenirken hata:", error);
      // Hata durumunda boş array'ler set et
      setGramerKonulari([]);
      setKelimeTemalari([]);
      setMetinTemalari([]);
    } finally {
      setLoading(false);
    }
  };

  // Normalize fonksiyonları
  const normalizeKonular = (data: any[]): Konu[] => {
    return data.map((item: any) => ({
      id: item.id ?? item.Id,
      baslik: item.baslik ?? item.Baslik,
      aciklama: item.aciklama ?? item.Aciklama,
      zorluk: (item.zorluk ?? item.Zorluk) || "Kolay",
      calismaSuresi: item.calismaSuresi ?? item.CalismaSuresi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl
    }));
  };

  const normalizeKelimeTemalari = (data: any[]): KelimeTema[] => {
    return data.map((item: any) => ({
      id: item.id ?? item.Id,
      baslik: item.baslik ?? item.Baslik,
      aciklama: item.aciklama ?? item.Aciklama,
      zorluk: (item.zorluk ?? item.Zorluk) || "Kolay",
      kelimeSayisi: item.kelimeSayisi ?? item.KelimeSayisi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl
    }));
  };

  const normalizeMetinTemalari = (data: any[]): MetinTema[] => {
    return data.map((item: any) => ({
      id: item.id ?? item.Id,
      temaId: item.temaId ?? item.TemaId,
      aciklama: item.aciklama ?? item.Aciklama,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl
    }));
  };

  const getDifficultyColor = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case "kolay": return "difficulty-beginner";
      case "orta": return "difficulty-intermediate";
      case "zor": return "difficulty-advanced";
      default: return "difficulty-beginner";
    }
  };

  const getDifficultyText = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case "kolay": return "Başlangıç";
      case "orta": return "Orta";
      case "zor": return "İleri";
      default: return zorluk;
    }
  };

  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) {
      return "/api/placeholder/400/250?text=Resim+Yok";
    }
    
    if (url.startsWith("http")) {
      return url;
    }
    
    return `http://localhost:5001${url}`;
  };

  if (loading) {
    return (
      <section className="quick-links-section">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>İçerikler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="quick-links-section">
      <div className="container">
        
        {/* Gramer Konuları */}
        <div className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <BookOutlined className="category-icon" />
              <h2>Gramer Konuları</h2>
            </div>
            <Link to="/konular" className="view-all-link">
              Tümünü Gör <span>→</span>
            </Link>
          </div>
          
          {gramerKonulari.length > 0 ? (
            <div className="cards-grid">
              {gramerKonulari.map((konu) => (
                <Link to={`/konular/${konu.id}`} key={konu.id} className="quick-link-card">
                  <div className="card-cover">
                    <img
                      src={getImageUrl(konu.kapakResmiUrl)}
                      alt={konu.baslik}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/250?text=Resim+Yok";
                      }}
                    />
                    <div className="card-overlay">
                      <span className={`difficulty-badge ${getDifficultyColor(konu.zorluk)}`}>
                        {getDifficultyText(konu.zorluk)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{konu.baslik}</h3>
                    <p className="card-description">{konu.aciklama}</p>
                    
                    <div className="card-meta">
                      <div className="meta-item">
                        <ClockCircleOutlined />
                        <span>{konu.calismaSuresi} dk</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-category">
              <BookOutlined className="empty-icon" />
              <p>Henüz gramer konusu bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Kelime Temaları */}
        <div className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <ReadOutlined className="category-icon" />
              <h2>Kelime Temaları</h2>
            </div>
            <Link to="/kelimetemalari" className="view-all-link">
              Tümünü Gör <span>→</span>
            </Link>
          </div>
          
          {kelimeTemalari.length > 0 ? (
            <div className="cards-grid">
              {kelimeTemalari.map((tema) => (
                <Link to={`/kelimetemalari/${tema.id}`} key={tema.id} className="quick-link-card">
                  <div className="card-cover">
                    <img
                      src={getImageUrl(tema.kapakResmiUrl)}
                      alt={tema.baslik}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/250?text=Resim+Yok";
                      }}
                    />
                    <div className="card-overlay">
                      <span className={`difficulty-badge ${getDifficultyColor(tema.zorluk)}`}>
                        {getDifficultyText(tema.zorluk)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{tema.baslik}</h3>
                    <p className="card-description">{tema.aciklama}</p>
                    
                    <div className="card-meta">
                      <div className="meta-item">
                        <BookOutlined />
                        <span>{tema.kelimeSayisi} kelime</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-category">
              <ReadOutlined className="empty-icon" />
              <p>Henüz kelime teması bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Metin Temaları */}
        <div className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <FileTextOutlined className="category-icon" />
              <h2>Okuma Metinleri</h2>
            </div>
            <Link to="/metinTema" className="view-all-link">
              Tümünü Gör <span>→</span>
            </Link>
          </div>
          
          {metinTemalari.length > 0 ? (
            <div className="cards-grid">
              {metinTemalari.map((tema) => (
                <Link to={`/metinler/${tema.id}`} key={tema.id} className="quick-link-card">
                  <div className="card-cover">
                    <img
                      src={getImageUrl(tema.kapakResmiUrl)}
                      alt={tema.aciklama}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/250?text=Resim+Yok";
                      }}
                    />
                    <div className="card-overlay">
                      <span className="theme-badge">Tema {tema.temaId}</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">Tema {tema.temaId}</h3>
                    <p className="card-description">{tema.aciklama}</p>
                    
                    <div className="card-footer">
                      <div className="read-more">
                        Metinleri Oku <FileTextOutlined />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-category">
              <FileTextOutlined className="empty-icon" />
              <p>Henüz metin teması bulunmuyor.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}