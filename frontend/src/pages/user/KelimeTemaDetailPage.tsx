import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Layout, Typography, Card, Row, Col, Spin } from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
}

interface TemaDetay {
  id: number;
  baslik: string;
  aciklama: string;
  kelimeler: Kelime[];
}

export default function KelimeTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<TemaDetay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/kelimetemalari/${id}`)
      .then((res) => {
        const t = res.data;
        setTema({
          id: t.id ?? t.Id,
          baslik: t.baslik ?? t.Baslik,
          aciklama: t.aciklama ?? t.Aciklama,
          kelimeler: (t.kelimeler ?? t.Kelimeler)?.map((k: any) => ({
            id: k.id ?? k.Id,
            ispanyolca: k.ispanyolca ?? k.Ispanyolca,
            turkce: k.turkce ?? k.Turkce
          })) ?? []
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </Layout>
    );
  }

  if (!tema) return <div className="p-6">Tema Bulunamadı</div>;

  return (
    <Content style={{ padding: "32px 16px", maxWidth: 900, margin: "0 auto" }}>
      <Link to="/kelimeler" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeftOutlined /> Geri
      </Link>

      <Title level={2} style={{ marginTop: 40, marginBottom: 16 }}>
  Kelimeler
</Title>

<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
  {tema.kelimeler.map((kelime) => (
    <div
      key={kelime.id}
      style={{
        background: "#fff",
        padding: "16px 20px",
        borderRadius: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#333" }}>
          {kelime.ispanyolca}
        </div>
        <div style={{ fontSize: 16, color: "#22c55e", marginTop: 4 }}>
          {kelime.turkce}
        </div>
      </div>
    </div>
  ))}
</div>


    </Content>
  );
}
