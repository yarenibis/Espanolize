import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Breadcrumb, Spin, Alert, Typography, Divider, Tag } from "antd";
import { HomeOutlined, ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";
import api from "../../services/ApiService";

const { Title, Text, Paragraph } = Typography;

interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama: string;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  ornekler: Ornek[];
  kategori?: string;
  zorlukSeviyesi?: "Başlangıç" | "Orta" | "İleri";
}

export default function GramerDetailPage() {
  const { id } = useParams();
  const [kural, setKural] = useState<GramerKural | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKural = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/kurallar/${id}`);
        setKural(response.data);
      } catch (err) {
        setError("Gramer kuralı yüklenirken bir hata oluştu.");
        console.error("Error fetching grammar rule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKural();
  }, [id]);

  const getDifficultyColor = (seviye?: string) => {
    switch (seviye) {
      case "Başlangıç": return "green";
      case "Orta": return "orange";
      case "İleri": return "red";
      default: return "blue";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" tip="Gramer kuralı yükleniyor..." />
      </div>
    );
  }

  if (error || !kural) {
    return (
      <div className="p-6">
        <Alert
          message="Hata"
          description={error || "Gramer kuralı bulunamadı."}
          type="error"
          showIcon
          action={
            <Link to="/gramerkurallar">
              <button className="ant-btn ant-btn-primary ant-btn-sm">
                Listeye Dön
              </button>
            </Link>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    {
      title: <Link to="/"><HomeOutlined /> Ana Sayfa</Link>,
    },
    {
      title: <Link to="/gramerkurallar"><BookOutlined /> Gramer Kuralları</Link>,
    },
    {
      title: kural.kuralBaslik,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      {/* Header Section */}
      <Card 
        className="shadow-lg mb-6 border-0"
        styles={{
          body: { padding: '24px' }
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Title level={1} className="!mb-0 !text-3xl text-gray-800">
                {kural.kuralBaslik}
              </Title>
              {kural.zorlukSeviyesi && (
                <Tag color={getDifficultyColor(kural.zorlukSeviyesi)} className="text-sm">
                  {kural.zorlukSeviyesi}
                </Tag>
              )}
            </div>
            
            {kural.kategori && (
              <Text type="secondary" className="text-base">
                Kategori: {kural.kategori}
              </Text>
            )}
          </div>

          <Link to="/gramerkurallar" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeftOutlined />
            <span>Geri Dön</span>
          </Link>
        </div>

        <Divider className="my-4" />

        {/* Açıklama */}
        <div className="mb-6">
          <Title level={3} className="!mb-3 text-xl">📖 Kural Açıklaması</Title>
          <Paragraph className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            {kural.aciklama}
          </Paragraph>
        </div>
      </Card>

      {/* Örnekler Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <span className="text-xl">💡 Örnekler</span>
            <Tag color="blue">{kural.ornekler.length} örnek</Tag>
          </div>
        }
        className="shadow-lg border-0"
        styles={{
          body: { padding: '0' }
        }}
      >
        <div className="space-y-4 p-6">
          {kural.ornekler.map((ornek, index) => (
            <div
              key={ornek.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Text strong className="text-lg text-gray-800 block mb-2">
                    {ornek.ispanyolcaOrnek}
                  </Text>
                  <Text type="success" className="text-base block mb-2 italic">
                    {ornek.ceviri}
                  </Text>
                  {ornek.aciklama && (
                    <Text type="secondary" className="text-sm block bg-yellow-50 p-3 rounded border-l-3 border-yellow-400">
                      💡 {ornek.aciklama}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <Link to="/gramerkurallar" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeftOutlined />
          <span>Gramer Kuralları Listesine Dön</span>
        </Link>
        
        <div className="flex gap-2">
          <button className="ant-btn ant-btn-default">
            📚 Benzer Kurallar
          </button>
          <button className="ant-btn ant-btn-primary">
            🎮 Alıştırma Yap
          </button>
        </div>
      </div>
    </div>
  );
}