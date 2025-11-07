import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/ApiService";
import { Card, Row, Col, Typography, Input, Layout, Spin } from "antd";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface MetinTema {
  id: number;
  baslik: string;
  aciklama: string;
}

export default function KelimeTemaListPage() {
  const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/metinTema")
      .then((res) => {
        const normalized = res.data.map((t: any) => ({
          id: t.id ?? t.Id,
          baslik: t.baslik ?? t.Baslik,
          aciklama: t.aciklama ?? t.Aciklama,
        }));
        setTemalar(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = temalar.filter(t =>
    `${t.baslik} ${t.aciklama}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </Layout>
    );
  }

  return (
    <Content style={{ padding: "32px 16px", maxWidth: 1100, margin: "0 auto" }}>
      <Title level={1}>📚 Kelime Temaları</Title>
      <Paragraph style={{ maxWidth: 600 }}>
        Temayı seç, ilgili kelimeleri anlamlarıyla birlikte öğren.
      </Paragraph>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Tema ara..."
        style={{ maxWidth: 400, margin: "20px 0" }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Row gutter={[24, 24]}>
        {filtered.map((tema) => (
          <Col xs={24} sm={12} lg={8} key={tema.id}>
            <Card
              hoverable
              onClick={() => navigate(`/metinler/${tema.id}`)}
              style={{ borderRadius: 12 }}
            >
              <BookOutlined style={{ fontSize: 28, color: "#3B82F6" }} />
              <Title level={4} style={{ marginTop: 12 }}>{tema.baslik}</Title>
              <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {tema.aciklama}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
}
