import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  BookOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  PictureOutlined
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KonuDetailPage.css";

interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama: string;
  gramerKuralId: number;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId: number;
  ornekler: Ornek[];
}

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "kolay" | "orta" | "zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
  temaId?: number;
  kurallar: GramerKural[];
  detayResimUrls?: string[];
}

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

export default function KonuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [konu, setKonu] = useState<Konu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchKonuDetay(parseInt(id));
    }
  }, [id]);

  const fetchKonuDetay = async (konuId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Konu detayları yükleniyor:", konuId);
      const konuRes = await api.get(`/konular/${konuId}`);
      console.log("Konu detay yanıtı:", konuRes.data);
      setKonu(konuRes.data);

    } catch (err: any) {
      console.error("Konu detayları yüklenirken hata:", err);
      setError(err.response?.data?.message || "Konu detayları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) {
      return "/api/placeholder/800/400?text=Resim+Yok";
    }
    
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    
    return `http://localhost:5001${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="konu-detail-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Konu yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !konu) {
    return (
      <div className="konu-detail-container">
        <Navbar />
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3 className="error-text">{error || "Konu bulunamadı"}</h3>
          <p>Lütfen daha sonra tekrar deneyin.</p>
          <button 
            onClick={() => navigate("/konular")}
            className="action-button primary"
            style={{ marginTop: '20px' }}
          >
            <ArrowLeftOutlined />
            Konulara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="konu-detail-container">
      <Navbar />
      
      {/* Header Section */}
      <div className="konu-header">
        <button 
          onClick={() => navigate("/konular")}
          className="back-button"
        >
          <ArrowLeftOutlined />
          Geri Dön
        </button>

        <div className="konu-header-content">
          <h1 className="konu-title">{konu.baslik}</h1>
          <p className="konu-description">{konu.aciklama}</p>
          
          <div className="konu-meta">
            <div className="meta-item">
              <ClockCircleOutlined className="meta-icon" />
              <span className="meta-text">{konu.calismaSuresi} dakika</span>
            </div>
            <div className="meta-item">
              <UserOutlined className="meta-icon" />
              <span className="meta-text">
                <span className={`difficulty-badge ${getDifficultyColor(konu.zorluk)}`}>
                  {getDifficultyText(konu.zorluk)} Seviye
                </span>
              </span>
            </div>
            <div className="meta-item">
              <BookOutlined className="meta-icon" />
              <span className="meta-text">{konu.kurallar?.length || 0} Kural</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="konu-detail-content">
        <div className="konu-main-content">
          {/* Content Column - Full width */}
          <div className="content-column-full">
            {/* Kapak Resmi */}
            {konu.kapakResmiUrl && (
              <div className="content-section">
                <div className="cover-image-container">
                  <img 
                    src={getImageUrl(konu.kapakResmiUrl)} 
                    alt={konu.baslik}
                    className="cover-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/800/400?text=Kapak+Resmi";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Detay Resimleri */}
            {konu.detayResimUrls && konu.detayResimUrls.length > 0 && (
              <div className="content-section">
                <h2 className="section-title">
                  <PictureOutlined />
                  Detay Görseller
                </h2>
                <div className="detail-images-grid">
                  {konu.detayResimUrls.map((imageUrl, index) => (
                    <div key={index} className="detail-image-item">
                      <img 
                        src={getImageUrl(imageUrl)} 
                        alt={`${konu.baslik} ${index + 1}`}
                        className="detail-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/300/200?text=Resim";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gramer Kuralları Section */}
            <div className="content-section">
              <h2 className="section-title">
                <BookOutlined />
                Gramer Kuralları
                <span className="rules-count">({konu.kurallar?.length || 0})</span>
              </h2>
              
              <div className="gramer-kurallari">
                <div className="kural-list">
                  {konu.kurallar && konu.kurallar.length > 0 ? (
                    konu.kurallar.map((kural) => (
                      <div key={kural.id} className="kural-item">
                        <h3 className="kural-baslik">
                          <CheckCircleOutlined style={{ color: '#48bb78' }} />
                          {kural.kuralBaslik}
                        </h3>
                        <p className="kural-aciklama">{kural.aciklama}</p>
                        
                        {/* Kurala ait örnekler */}
                        {kural.ornekler && kural.ornekler.length > 0 && (
                          <div className="ornek-list">
                            <h4 className="ornekler-title">
                              Örnekler:
                            </h4>
                            {kural.ornekler.map((ornek) => (
                              <div key={ornek.id} className="ornek-item">
                                <div className="ornek-header">
                                  <div className="ispanyolca-ornek">"{ornek.ispanyolcaOrnek}"</div>
                                  <div className="ceviri">→ "{ornek.ceviri}"</div>
                                </div>
                                {ornek.aciklama && (
                                  <p className="ornek-aciklama">{ornek.aciklama}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-rules">
                      <div className="empty-icon">📝</div>
                      <p>Bu konu için henüz gramer kuralı eklenmemiş.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}