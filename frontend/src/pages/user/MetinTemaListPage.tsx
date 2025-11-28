import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import api from "../../services/ApiService";
import "./MetinTemaListPage.css";
import Navbar from "../../components/Navbar";

interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
}

export default function MetinTemaListPage() {
  const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemalar();
  }, []);

  const fetchTemalar = async () => {
    try {
      console.log("Metin temaları yükleniyor...");
      const res = await api.get("/metinTema");
      console.log("API yanıtı:", res.data);
      
      const normalized = res.data.map((t: any) => ({
        id: t.id ?? t.Id,
        temaId: t.temaId ?? t.TemaId,
        aciklama: t.aciklama ?? t.Aciklama,
        kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl
      }));
      
      setTemalar(normalized);
    } catch (error) {
      console.error("Metin temaları yüklenirken hata:", error);
      setTemalar([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemalar = temalar.filter((tema) =>
    `${tema.aciklama} ${tema.temaId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleTemaClick = (temaId: number) => {
    console.log("Metin temasına tıklandı:", temaId);
    navigate(`/metinler/${temaId}`);
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
      <div className="metin-tema-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Metin temaları yükleniyor...</p>
      </div>
    );
  }

  return (

    <div className="metin-tema-container">
      <Navbar />
      <div className="metin-tema-content">
        {/* Header Section */}
        <div className="metin-tema-header">
          <h1 className="metin-tema-main-title">📖 Metin Temaları</h1>
          <p className="metin-tema-subtitle">
            Temaları keşfedin, İspanyolca metinleri okuyun ve dil becerilerinizi geliştirin
          </p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-wrapper">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="Metin teması ara... (örn: Hikayeler, Kültür, Günlük Yaşam)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

    

        {/* Empty State */}
        {!loading && filteredTemalar.length === 0 && (
          <div className="empty-state">
            <FileTextOutlined className="empty-icon" />
            <h3 className="empty-text">
              {searchTerm ? "Arama kriterlerinize uygun tema bulunamadı." : "Henüz hiç metin teması bulunmuyor."}
            </h3>
            <p className="empty-subtext">
              {searchTerm ? "Farklı bir arama terimi deneyin." : "Yakında yeni metin temaları eklenecek."}
            </p>
          </div>
        )}

        {/* Temalar Grid */}
        {!loading && filteredTemalar.length > 0 && (
          <>
            <div className="metin-tema-grid">
              {filteredTemalar.map((tema, index) => (
                <div
                  key={tema.id}
                  className="metin-tema-card"
                  onClick={() => handleTemaClick(tema.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Cover */}
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

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="card-header">
                      <div className="card-icon">
                        <FileTextOutlined />
                      </div>
                      <h3 className="card-title">Tema {tema.temaId}</h3>
                    </div>

                    <p className="card-description">
                      {tema.aciklama}
                    </p>

                    
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