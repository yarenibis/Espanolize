import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, SearchOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KonuListPage.css";

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
  temaId?: number;
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

export default function KonuListPage() {
  const [konular, setKonular] = useState<Konu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchKonular();
  }, []);

  const fetchKonular = async () => {
    try {
      console.log("Konular yükleniyor...");
      const res = await api.get("/konular");
      console.log("API yanıtı:", res.data);
      setKonular(res.data);
    } catch (error) {
      console.error("Konular yüklenirken hata:", error);
      // Hata durumunda boş array set et
      setKonular([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKonular = konular.filter((konu) =>
    `${konu.baslik} ${konu.aciklama} ${konu.zorluk}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleKonuClick = (konuId: number) => {
    console.log("Konuya tıklandı:", konuId);
    navigate(`/konular/${konuId}`);
  };

  // Kapak resmi URL'sini düzenleme fonksiyonu
  const getImageUrl = (kapakResmiUrl: string | null | undefined) => {
    if (!kapakResmiUrl) {
      return "/api/placeholder/400/220?text=Resim+Yok";
    }
    
    if (kapakResmiUrl.startsWith("http")) {
      return kapakResmiUrl;
    }
    
    return `http://localhost:5001${kapakResmiUrl}`;
  };

  return (
    <div className="konu-list-container">
      <Navbar />
      <div className="konu-list-content">
        {/* Header Section */}
        <div className="konu-header">
          <h1 className="konu-main-title"> İspanyolca Konuları</h1>
          <p className="konu-subtitle">
            Seviyenize uygun konuları keşfedin, interaktif içeriklerle İspanyolcanızı geliştirin
          </p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Konu ara... (örn: ser estar, fiiller, zamanlar)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Konular yükleniyor...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredKonular.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-text">
              {searchTerm ? "Arama kriterlerinize uygun konu bulunamadı." : "Henüz hiç konu bulunmuyor."}
            </h3>
            <p className="empty-subtext">
              {searchTerm ? "Farklı bir arama terimi deneyin." : "Yakında yeni konular eklenecek."}
            </p>
          </div>
        )}

        {/* Konular Grid */}
        {!loading && filteredKonular.length > 0 && (
          <>
            <div className="konu-grid">
              {filteredKonular.map((konu, index) => (
                <div
                  key={konu.id}
                  className="konu-card"
                  onClick={() => handleKonuClick(konu.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Cover */}
                  <div className="card-cover">
                    <img
                      src={getImageUrl(konu.kapakResmiUrl)}
                      alt={konu.baslik}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/220?text=Resim+Yok";
                      }}
                    />
                    <div className="card-overlay">
                      <span className={`difficulty-badge ${getDifficultyColor(konu.zorluk)}`}>
                        {getDifficultyText(konu.zorluk)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-icon">
                        <BookOutlined />
                      </div>
                      <h3 className="card-title">{konu.baslik}</h3>
                    </div>

                    <p className="card-description">
                      {konu.aciklama}
                    </p>

                    <div className="card-meta">
                      <div className="meta-info">
                        <div className="meta-item">
                          <ClockCircleOutlined className="meta-icon" />
                          <span>{konu.calismaSuresi} dk</span>
                        </div>
                        <div className="meta-item">
                          <UserOutlined className="meta-icon" />
                          <span>{konu.zorluk}</span>
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat">
                          <BookOutlined className="stat-icon" />
                          <span>Konu</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}