import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Input, Spin, Empty, Tag } from "antd";
import { SearchOutlined, BookOutlined } from "@ant-design/icons";
import api from "../../services/ApiService";
import Navbar from "../../components/Navbar";

const { Title, Paragraph } = Typography;
const { Search } = Input;

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  kapakResmiUrl?: string | null;
  zorlukSeviyesi?: "Başlangıç" | "Orta" | "İleri";
}

const getLevelColor = (level?: string) => {
  switch (level) {
    case "Başlangıç": return "green";
    case "Orta": return "orange";
    case "İleri": return "red";
    default: return "blue";
  }
};

// Özel CSS
const cardStyle = `
  .gramer-card .ant-card-cover {
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
  }
  
  .gramer-card .ant-card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .gramer-card:hover .ant-card-cover img {
    transform: scale(1.05);
  }
  
  .gramer-card .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export default function GramerListPage() {
  const [kurallar, setKurallar] = useState<GramerKural[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // CSS'i head'e ekle
    const styleElement = document.createElement('style');
    styleElement.textContent = cardStyle;
    document.head.appendChild(styleElement);

    return () => {
      // Component unmount olduğunda CSS'i temizle
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    api.get("/kurallar")
      .then((res) => setKurallar(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = kurallar.filter((kural) =>
    `${kural.kuralBaslik} ${kural.aciklama}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto py-16 px-4">
        <Title level={1} className="text-center font-bold mb-6">
          📘 İspanyolca Gramer Kuralları
        </Title>

        <Paragraph className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Açıklamalar, örnekler ve görsellerle gramer kurallarını kolayca öğren.
        </Paragraph>

        <Search
          placeholder="Kural ara..."
          enterButton={<SearchOutlined />}
          size="large"
          className="max-w-md mx-auto block mb-12"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && (
          <div className="grid place-items-center h-40">
            <Spin size="large" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <Empty description="Hiç kural bulunamadı." />
        )}

        <Row gutter={[24, 24]}>
          {filtered.map((kural) => (
            <Col xs={24} sm={12} lg={8} key={kural.id}>
              <Card
                hoverable
                onClick={() => navigate(`/gramer/${kural.id}`)}
                className="gramer-card h-full flex flex-col rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                cover={
                  <div className="w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      alt={kural.kuralBaslik}
                      src={
                        kural.kapakResmiUrl
                          ? kural.kapakResmiUrl.startsWith("http")
                            ? kural.kapakResmiUrl
                            : `http://localhost:5001${kural.kapakResmiUrl}`
                          : "/no-cover.png"
                      }
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/no-cover.png";
                      }}
                    />
                  </div>
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOutlined style={{ fontSize: 24, color: "#7b61ff" }} />
                  <Title level={4} className="!mb-0">{kural.kuralBaslik}</Title>
                </div>

                <Paragraph ellipsis={{ rows: 3 }} className="flex-grow">
                  {kural.aciklama}
                </Paragraph>

                {kural.zorlukSeviyesi && (
                  <div className="mt-auto pt-3">
                    <Tag color={getLevelColor(kural.zorlukSeviyesi)}>
                      {kural.zorlukSeviyesi}
                    </Tag>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}