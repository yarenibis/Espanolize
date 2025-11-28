// KelimeTemaListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, SearchOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KelimeTemaListPage.css";

interface KelimeTema {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  kelimeSayisi: number;
  kapakResmiUrl?: string;
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

export default function KelimeTemaListPage() {
  const [temalar, setTemalar] = useState<KelimeTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemalar();
  }, []);

  const fetchTemalar = async () => {
    try {
      console.log("Temalar yükleniyor...");
      const res = await api.get("/kelimetemalari");
      console.log("API yanıtı:", res.data);
      
      const normalized = res.data.map((t: any) => ({
        id: t.id ?? t.Id,
        baslik: t.baslik ?? t.Baslik,
        aciklama: t.aciklama ?? t.Aciklama,
        kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
        kelimeSayisi: Math.floor(Math.random() * 30) + 15, // 15-45 arası rastgele
        zorluk: ["Kolay", "Orta", "Zor"][Math.floor(Math.random() * 3)] as "Kolay" | "Orta" | "Zor"
      }));
      
      setTemalar(normalized);
    } catch (error) {
      console.error("Temalar yüklenirken hata:", error);
      setTemalar([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemalar = temalar.filter((tema) =>
    `${tema.baslik} ${tema.aciklama} ${tema.zorluk}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleTemaClick = (temaId: number) => {
    console.log("Temaya tıklandı:", temaId);
    navigate(`/kelimeler/${temaId}`);
  };

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
    <div className="kelime-tema-container">
      <Navbar />
      
      <div className="kelime-tema-content">
        {/* Header Section */}
        <div className="kelime-tema-header">
          <h1 className="kelime-tema-main-title">📚 Kelime Temaları</h1>
          <p className="kelime-tema-subtitle">
            Temaları keşfedin, ilgili kelimeleri anlamlarıyla birlikte öğrenin ve 
            İspanyolca kelime dağarcığınızı geliştirin
          </p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-wrapper">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="Tema ara... (örn: Yiyecekler, Seyahat, Sağlık)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Temalar yükleniyor...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemalar.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-text">
              {searchTerm ? "Arama kriterlerinize uygun tema bulunamadı." : "Henüz hiç tema bulunmuyor."}
            </h3>
            <p className="empty-subtext">
              {searchTerm ? "Farklı bir arama terimi deneyin." : "Yakında yeni temalar eklenecek."}
            </p>
          </div>
        )}

        {/* Temalar Grid */}
        {!loading && filteredTemalar.length > 0 && (
          <>
            <div className="kelime-tema-grid">
              {filteredTemalar.map((tema, index) => (
                <div
                  key={tema.id}
                  className="kelime-tema-card"
                  onClick={() => handleTemaClick(tema.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Cover */}
                  <div className="card-cover">
                    <img
                      src={getImageUrl(tema.kapakResmiUrl)}
                      alt={tema.baslik}
                      className="card-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/220?text=Resim+Yok";
                      }}
                    />
                    <div className="card-overlay">
                      <span className={`difficulty-badge ${getDifficultyColor(tema.zorluk)}`}>
                        {getDifficultyText(tema.zorluk)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-icon">
                        <BookOutlined />
                      </div>
                      <h3 className="card-title">{tema.baslik}</h3>
                    </div>

                    <p className="card-description">
                      {tema.aciklama}
                    </p>

                    <div className="card-meta">
                      <div className="meta-info">
                        <div className="meta-item">
                          <BookOutlined className="meta-icon" />
                          <span>{tema.kelimeSayisi} kelime</span>
                        </div>
                        <div className="meta-item">
                          <UserOutlined className="meta-icon" />
                          <span>{tema.zorluk}</span>
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat">
                          <ClockCircleOutlined className="stat-icon" />
                          <span>Kelime</span>
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