import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Layout, Typography, Spin, Button, Image, Carousel } from "antd";
import { ArrowLeftOutlined, SoundOutlined, CopyOutlined } from "@ant-design/icons";
import "./KelimeTemaDetailPage.css";
import Navbar from "../../components/Navbar";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
  kelimeTemasiId: number;
}

interface TemaDetay {
  id: number;
  aciklama: string;
  temaId: number;
  kapakResmiUrl: string;
  detayResimUrls: string[];
  kelimeler: Kelime[];
}

export default function KelimeTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<TemaDetay | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedWord, setCopiedWord] = useState<number | null>(null);

  useEffect(() => {
    api.get(`/kelimetemalari/${id}`)
      .then((res) => {
        const t = res.data;
        console.log("API Yanıtı:", t);
        
        setTema({
          id: t.id ?? t.Id,
          aciklama: t.aciklama ?? t.Aciklama,
          temaId: t.temaId ?? t.TemaId,
          kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
          detayResimUrls: t.detayResimUrls ?? t.DetayResimUrls ?? [],
          kelimeler: (t.kelimeler ?? t.Kelimeler)?.map((k: any) => ({
            id: k.id ?? k.Id,
            ispanyolca: k.ispanyolca ?? k.Ispanyolca,
            turkce: k.turkce ?? k.Turkce,
            kelimeTemasiId: k.kelimeTemasiId ?? k.KelimeTemasiId
          })) ?? []
        });
      })
      .catch(error => {
        console.error("API Hatası:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'es' ? 'es-ES' : 'tr-TR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string, wordId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedWord(wordId);
      setTimeout(() => setCopiedWord(null), 2000);
    });
  };

  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) {
      return "/api/placeholder/300/200?text=Resim+Yok";
    }
    
    if (url.startsWith("http")) {
      return url;
    }
    
    return `http://localhost:5001${url}`;
  };

  if (loading) {
    return (
      <Layout className="kelime-detail-loading">
        <Spin size="large" />
        <Paragraph className="loading-text">Kelimeler yükleniyor...</Paragraph>
      </Layout>
    );
  }

  if (!tema) {
    return (
      <div className="kelime-detail-error">
        <Title level={2}>Tema Bulunamadı</Title>
        <Paragraph>Lütfen geçerli bir tema seçin.</Paragraph>
        <Link to="/kelimeler">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Temalara Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="kelime-detail-container">
      <Navbar/>
      <h1 className="tema-title">Tema {tema.temaId}</h1>
  <p className="tema-aciklama">{tema.aciklama}</p>
      <Content className="kelime-detail-content">
        



        {/* Kelimeler Listesi */}
        <div className="kelimeler-section">
          
          
          <div className="kelimeler-list">
  {tema.kelimeler.map((kelime, index) => (
    <div key={kelime.id}>
      
      {/* Kelime Kartı */}
      <div className="kelime-item">
        <div className="kelime-content">
          <div className="kelime-text">
            <Text className="kelime-ispanyolca" strong>
              {kelime.ispanyolca}
            </Text>
            <Text className="kelime-turkce">
              {kelime.turkce}
            </Text>
          </div>

          <div className="kelime-actions">
            <Button
              type="text"
              icon={<CopyOutlined />}
              className={`action-btn ${copiedWord === kelime.id ? "copied" : ""}`}
              onClick={() => copyToClipboard(kelime.ispanyolca, kelime.id)}
              title="Kopyala"
            />
          </div>
        </div>

        {copiedWord === kelime.id && (
          <div className="copy-feedback">Kopyalandı!</div>
        )}
      </div>

      {/* 🔥 ARAYA SERPİŞTİRİLEN RESİM */}
      {tema.detayResimUrls[index] && (
        <div className="inline-image-wrapper">
          <img
            className="inline-image"
            src={getImageUrl(tema.detayResimUrls[index])}
            alt="detay"
          />
        </div>
      )}
    </div>
  ))}
</div>

        </div>

      
      </Content>
    </div>
  );
}