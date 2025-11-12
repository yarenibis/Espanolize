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
    max-height: 400px;
    width: 100%;
    object-fit: contain;
  }
  
  .kapak-resim-container {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    max-height: 500px;
    overflow: hidden;
  }

  /* Detay galeri için kompakt stil */
  .detail-gallery-container {
    aspect-ratio: 1;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e8e8e8;
  }
  
  .detail-gallery-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
    padding: 8px;
  }
  
  .detail-gallery-container:hover .detail-gallery-image {
    transform: scale(1.08);
  }

  /* Daha sıkı grid düzeni */
  .compact-grid {
    gap: 12px !important;
  }

  /* Küçük ekranlar için daha fazla sütun */
  @media (max-width: 640px) {
    .compact-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px !important;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .compact-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1025px) {
    .compact-grid {
      grid-template-columns: repeat(5, 1fr);
    }
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

      <div className="max-w-5xl mx-auto py-12 px-4">
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

          <Paragraph className="text-gray-600 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            {kural.aciklama}
          </Paragraph>

          {kural.zorlukSeviyesi && (
            <Tag color="blue" className="mt-4 p-1 px-3 text-sm">
              {kural.zorlukSeviyesi}
            </Tag>
          )}
        </Card>

        {/* 📷 Detay Görselleri - KOMPAKT VERSİYON */}
        {kural.detayResimUrls?.length > 0 && (
          <div className="mb-12">
            <Title level={3} className="mb-4 flex items-center gap-2">
              <PictureOutlined /> Detay Görselleri
            </Title>

            <div className="compact-grid grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {kural.detayResimUrls.map((url: string, i: number) => (
                <div key={i} className="detail-gallery-container">
                  <Image
                    src={getImageUrl(url)}
                    alt={`${kural.kuralBaslik} - Detay ${i + 1}`}
                    className="detail-gallery-image"
                    preview={{
                      mask: <span className="text-white text-xs">👁️</span>,
                    }}
                    fallback="/no-cover.png"
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