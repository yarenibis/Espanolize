import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Input, Button, Breadcrumb, Spin, Empty } from "antd";
import { SearchOutlined, FileTextOutlined, HomeOutlined, ArrowRightOutlined, BookOutlined } from "@ant-design/icons";
import api from "../../services/ApiService";

const { Title, Paragraph } = Typography;
const { Search } = Input;

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId?: number;
}

export default function GramerListPage() {
  const [kurallar, setKurallar] = useState<GramerKural[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/kurallar")
      .then((res) => setKurallar(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = kurallar.filter((kural) =>
    `${kural.kuralBaslik} ${kural.aciklama}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh", padding: "32px 16px" }}>

      {/* Header */}
      <div style={{ 
        background: "#fff", 
        padding: "16px 32px", 
        display: "flex", 
        alignItems: "center", 
        gap: 8,
        borderBottom: "1px solid #eee",
        marginBottom: 32
      }}>
        <FileTextOutlined style={{ fontSize: 26, color: "#1890ff" }} />
        <Title level={3} style={{ margin: 0 }}>Gramer Kuralları</Title>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        <Breadcrumb
          items={[
            { title: <span onClick={() => navigate("/")}><HomeOutlined /> Ana Sayfa</span> },
            { title: "Gramer Kuralları" }
          ]}
          style={{ marginBottom: 24 }}
        />

        <Title level={1} style={{ marginBottom: 12 }}>📘 Gramer Kuralları</Title>
        <Paragraph style={{ maxWidth: 600, marginBottom: 24 }}>
          Açıklamalar ve örnek cümlelerle İspanyolca gramer kurallarını öğren.
        </Paragraph>

        <Search
          placeholder="Kural veya açıklama ara..."
          allowClear
          size="large"
          style={{ maxWidth: 400, marginBottom: 32 }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Eğer sonuç yoksa */}
        {filtered.length === 0 && (
          <Empty description="Kural bulunamadı." />
        )}

        {/* Kartlar */}
        <Row gutter={[24, 24]}>
          {filtered.map((kural) => (
            <Col xs={24} sm={12} lg={8} key={kural.id}>
              <Card
                hoverable
                onClick={() => navigate(`/gramer/${kural.id}`)}
                style={{ borderRadius: 10 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOutlined style={{ fontSize: 22, color: "#7b61ff" }} />
                  <Title level={4} style={{ margin: 0 }}>{kural.kuralBaslik}</Title>
                </div>

                <Paragraph ellipsis={{ rows: 3 }} style={{ marginTop: 12 }}>
                  {kural.aciklama}
                </Paragraph>

                <Button type="link" icon={<ArrowRightOutlined />}>
                  Detayları Gör
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

      </div>

    </div>
  );
}
