import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Layout, Typography, Spin, Button } from "antd";
import { ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
import "./MetinTemaDetailPage.css";
import Navbar from "../../components/Navbar";

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
  metinler: Metin[];
}

export default function MetinTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<MetinTemaDetay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/metinTema/${id}`)
      .then((res) => {
        setTema({
          id: res.data.id,
          aciklama: res.data.aciklama,
          temaId: res.data.temaId,
          metinler: res.data.metinler || [],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout className="metin-loading">
        <Spin size="large" />
        <Paragraph>Metinler yükleniyor...</Paragraph>
      </Layout>
    );
  }

  if (!tema) {
    return (
      <div className="metin-error">
        <Title level={2}>Tema Bulunamadı</Title>
        <Paragraph>Geçerli bir metin teması seçin.</Paragraph>
        <Link to="/metinler">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Geri Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="metin-container">
      <Navbar/>
      <h1 className="tema-title">Tema {tema.temaId}</h1>
      <p className="tema-aciklama">{tema.aciklama}</p>

      <Content className="metin-content">

        <div className="metin-list">
          {tema.metinler.map((metin) => (
            <div key={metin.id} className="metin-item">

              <div className="metin-header-static">
                <FileTextOutlined className="metin-header-icon" />
                <div>
                  <h3 className="metin-baslik">{metin.baslik}</h3>
                  <p className="metin-aciklama">{metin.aciklama}</p>
                </div>
              </div>

              <div className="metin-icerik-static">
                <Text className="metin-yazi">{metin.icerik}</Text>
              </div>

            </div>
          ))}
        </div>

      </Content>
    </div>
  );
}
