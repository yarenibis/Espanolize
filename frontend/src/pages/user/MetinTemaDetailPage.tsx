// MetinTemaDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Layout, Typography, Spin, Button, Image, Carousel, Tag } from "antd";
import { ArrowLeftOutlined, FileTextOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import "./MetinTemaDetailPage.css";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Metin {
  id: number;
  baslik: string;
  icerik: string;
  aciklama: string;
  zorluk: string;
  okumaSuresi: number;
  kapakResmiUrl?: string;
  metinTemaId: number;
}

interface MetinTemaDetay {
  id: number;
  aciklama: string;
  temaId: number;
  kapakResmiUrl: string;
  detayResimUrls: string[];
  metinler: Metin[];
}

export default function MetinTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<MetinTemaDetay | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMetinId, setExpandedMetinId] = useState<number | null>(null);

  useEffect(() => {
    fetchTemaDetay();
  }, [id]);

  const fetchTemaDetay = async () => {
    try {
      console.log("Metin teması detayı yükleniyor...");
      const res = await api.get(`/metinTema/${id}`);
      console.log("API yanıtı:", res.data);
      
      setTema({
        id: res.data.id,
        aciklama: res.data.aciklama,
        temaId: res.data.temaId,
        kapakResmiUrl: res.data.kapakResmiUrl,
        detayResimUrls: res.data.detayResimUrls || [],
        metinler: res.data.metinler || []
      });
    } catch (error) {
      console.error("Metin teması detayı yüklenirken hata:", error);
    } finally {
      setLoading(false);
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

  const toggleMetinExpansion = (metinId: number) => {
    setExpandedMetinId(expandedMetinId === metinId ? null : metinId);
  };

  const getZorlukColor = (zorluk: string) => {
    switch (zorluk?.toLowerCase()) {
      case "kolay": return "green";
      case "orta": return "orange";
      case "zor": return "red";
      default: return "blue";
    }
  };

  if (loading) {
    return (
      <Layout className="metin-detail-loading">
        <Spin size="large" />
        <Paragraph className="loading-text">Metinler yükleniyor...</Paragraph>
      </Layout>
    );
  }

  if (!tema) {
    return (
      <div className="metin-detail-error">
        <Title level={2}>Metin Teması Bulunamadı</Title>
        <Paragraph>Lütfen geçerli bir metin teması seçin.</Paragraph>
        <Link to="/metinler">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Tüm Temalara Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="metin-detail-container">
      <Content className="metin-detail-content">
        {/* Header Section */}
        <div className="detail-header">
          <div className="header-background">
            {tema.kapakResmiUrl && (
              <Image
                src={getImageUrl(tema.kapakResmiUrl)}
                alt={tema.aciklama}
                className="header-background-image"
                preview={false}
                fallback="/api/placeholder/1200/400?text=Resim+Yok"
              />
            )}
            <div className="header-overlay" />
          </div>
          
          <Link to="/metinler" className="back-button">
            <ArrowLeftOutlined />
            <span>Tüm Metin Temaları</span>
          </Link>
          
          <div className="header-content">
            <div className="title-section">
              <FileTextOutlined className="title-icon" />
              <div>
                <Title level={1} className="main-title">Tema {tema.temaId}</Title>
                <Paragraph className="theme-description">{tema.aciklama}</Paragraph>
              </div>
            </div>
            
            <div className="theme-stats">
              <div className="stat-item">
                <span className="stat-number">{tema.metinler.length}</span>
                <span className="stat-label">Metin</span>
              </div>
              <div className="stat-item">
                <span className="stat-difficulty">Tema {tema.temaId}</span>
                <span className="stat-label">Tema No</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {tema.detayResimUrls && tema.detayResimUrls.length > 0 && (
          <div className="gallery-section">
            <Title level={3} className="gallery-title">Tema Görselleri</Title>
            <Carousel 
              autoplay 
              dots={{ className: 'gallery-dots' }}
              className="gallery-carousel"
            >
              {tema.detayResimUrls.map((imageUrl, index) => (
                <div key={index} className="gallery-slide">
                  <Image
                    src={getImageUrl(imageUrl)}
                    alt={`Tema görseli ${index + 1}`}
                    className="gallery-image"
                    preview={{
                      mask: <div className="preview-mask">👁️ Görüntüle</div>,
                    }}
                    fallback="/api/placeholder/800/400?text=Resim+Yok"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Metinler Listesi */}
        <div className="metinler-section">
          <Title level={2} className="metinler-title">
            Metinler ({tema.metinler.length} metin)
          </Title>
          
          {tema.metinler.length === 0 ? (
            <div className="empty-metinler">
              <FileTextOutlined className="empty-icon" />
              <Paragraph className="empty-text">Bu tema için henüz metin eklenmemiş.</Paragraph>
              <Paragraph className="empty-subtext">Yakında yeni metinler eklenecek.</Paragraph>
            </div>
          ) : (
            <div className="metinler-list">
              {tema.metinler.map((metin, index) => (
                <div 
                  key={metin.id} 
                  className={`metin-item ${expandedMetinId === metin.id ? 'expanded' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Metin Header */}
                  <div 
                    className="metin-header"
                    onClick={() => toggleMetinExpansion(metin.id)}
                  >
                    <div className="metin-icon-container">
                      <FileTextOutlined className="metin-icon" />
                    </div>
                    
                    <div className="metin-info">
                      <Title level={4} className="metin-baslik">{metin.baslik}</Title>
                      <Paragraph className="metin-aciklama">{metin.aciklama}</Paragraph>
                      
                      <div className="metin-meta">
                        <div className="meta-items">
                          <span className="meta-item">
                            <ClockCircleOutlined className="meta-icon" />
                            {metin.okumaSuresi} dk
                          </span>
                          <span className="meta-item">
                            <UserOutlined className="meta-icon" />
                            <Tag color={getZorlukColor(metin.zorluk)} className="zorluk-tag">
                              {metin.zorluk}
                            </Tag>
                          </span>
                        </div>
                        
                        <div className="expand-icon">
                          <span className={`expand-arrow ${expandedMetinId === metin.id ? 'expanded' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metin İçerik */}
                  {expandedMetinId === metin.id && (
                    <div className="metin-icerik">
                      <div className="icerik-container">
                        {metin.kapakResmiUrl && (
                          <div className="metin-image-container">
                            <Image
                              src={getImageUrl(metin.kapakResmiUrl)}
                              alt={metin.baslik}
                              className="metin-image"
                              preview={{
                                mask: <div className="preview-mask">👁️ Görüntüle</div>,
                              }}
                              fallback="/api/placeholder/600/300?text=Resim+Yok"
                            />
                          </div>
                        )}
                        
                        <div className="metin-text-container">
                          <Text className="metin-text">
                            {metin.icerik}
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="footer-actions">
          <Link to="/metinler">
            <Button icon={<ArrowLeftOutlined />} size="large">
              Tüm Metin Temalarına Dön
            </Button>
          </Link>
        </div>
      </Content>
    </div>
  );
}