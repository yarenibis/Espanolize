import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Spin, Typography, Tag, Image } from "antd";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import { ArrowLeftOutlined, PictureOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

// Özel CSS
const imageStyles = `
  .detail-page-image {
    width: 100%;
    height: 250px; /* Daha kısa yükseklik */
    object-fit: cover; /* Resmi kutuya sığdır */
    border-radius: 8px;
  }
  
  .kapak-resim-container {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 0; /* Padding'i kaldırdık */
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
  }

  /* Çok küçük detay galeri için stil - YAN YANA */
  .detail-gallery-container {
    width: 100%;
    height: 80px;
    background: #f8f9fa;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .detail-gallery-container:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .detail-gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }
  
  .detail-gallery-container:hover .detail-gallery-image {
    transform: scale(1.08);
  }

  /* YAN YANA grid düzeni - FLEX kullanıyoruz */
  .horizontal-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  /* Küçük ekranlar için */
  @media (max-width: 640px) {
    .horizontal-gallery {
      gap: 6px;
    }
    .detail-gallery-container {
      width: 70px;
      height: 70px;
      flex-shrink: 0;
    }
    .detail-page-image {
      height: 200px; /* Mobilde biraz daha kısa */
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .detail-gallery-container {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }
    .detail-page-image {
      height: 220px;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .detail-gallery-container {
      width: 90px;
      height: 90px;
      flex-shrink: 0;
    }
    .detail-page-image {
      height: 240px;
    }
  }

  @media (min-width: 1025px) {
    .detail-gallery-container {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
    }
  }

  /* Preview modal için maksimum boyut */
  .ant-image-preview-img {
    max-height: 80vh !important;
    max-width: 90vw !important;
    object-fit: contain;
  }
`;

export default function GramerDetailPage() {
  const { id } = useParams();
  const [kural, setKural] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = imageStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    api.get(`/kurallar/${id}`).then((res) => {
      setKural(res.data);
      setLoading(false);
    });
  }, [id]);

  const getImageUrl = (url: string) => {
    if (!url) return "/no-cover.png";
    if (url.startsWith("http")) return url;
    return `http://localhost:5001${url}`;
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4">
        <Link
          to="/gramerkurallar"
          className="text-blue-600 flex items-center gap-2 mb-6 hover:underline"
        >
          <ArrowLeftOutlined /> Geri Dön
        </Link>

        <Card className="rounded-2xl shadow-lg p-8 mb-10">
          <Title level={2} className="mb-4">
            {kural.kuralBaslik}
          </Title>

          {kural.kapakResmiUrl && (
            <div className="kapak-resim-container">
              <img
                src={getImageUrl(kural.kapakResmiUrl)}
                alt={kural.kuralBaslik}
                className="detail-page-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/no-cover.png";
                }}
              />
            </div>
          )}

          <Paragraph className="text-gray-600 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mt-6">
            {kural.aciklama}
          </Paragraph>

          {kural.zorlukSeviyesi && (
            <Tag color="blue" className="mt-4 p-1 px-3 text-sm">
              {kural.zorlukSeviyesi}
            </Tag>
          )}
        </Card>

        {/* 📷 Detay Görselleri - YAN YANA FLEX */}
        {kural.detayResimUrls?.length > 0 && (
          <div className="mb-12">
            <Title level={3} className="mb-4 flex items-center gap-2">
              <PictureOutlined /> Detay Görselleri ({kural.detayResimUrls.length})
            </Title>

            <div className="horizontal-gallery">
              {kural.detayResimUrls.map((url: string, i: number) => (
                <div key={i} className="detail-gallery-container">
                  <Image
                    src={getImageUrl(url)}
                    alt={`${kural.kuralBaslik} - Detay ${i + 1}`}
                    className="detail-gallery-image"
                    preview={{
                      mask: <span className="text-xs">👁️</span>,
                    }}
                    fallback="/no-cover.png"
                    placeholder={
                      <div className="flex items-center justify-center h-full">
                        <Spin size="small" />
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 💡 Örnekler */}
        {kural.ornekler && kural.ornekler.length > 0 && (
          <>
            <Title level={3} className="mb-4">
              💡 Örnekler
            </Title>
            <div className="space-y-4">
              {kural.ornekler.map((o: any, i: number) => (
                <Card
                  key={i}
                  className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <Text strong className="text-lg block mb-2">
                    {o.ispanyolcaOrnek}
                  </Text>
                  <Text className="text-green-600 italic block mb-2">
                    {o.ceviri}
                  </Text>
                  {o.aciklama && (
                    <Text className="text-gray-500 text-sm">{o.aciklama}</Text>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}