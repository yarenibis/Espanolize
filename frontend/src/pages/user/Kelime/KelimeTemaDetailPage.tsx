import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/ApiService";
import { Spin, Button, message } from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import "./KelimeTemaDetailPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { Helmet } from "react-helmet-async";

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
}

interface KelimeTemaApi {
  id: number;
  aciklama: string;
  temaId: number;
  kapakResmiUrl?: string;
  detayResimUrls?: string[];
  kelimeler: Kelime[];
}

interface TemaApi {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

export default function KelimeTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<KelimeTemaApi | null>(null);
  const [temaBaslik, setTemaBaslik] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [copiedWord, setCopiedWord] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
   
        let res;

        try {
          res = await api.get(`/kelimetemalari/${id}`);
        } catch (error: any) {
          message.error("Kelime teması yüklenirken hata oluştu!");
          console.error(error);
          return;
        }

        const t = res.data;

        const mappedTema: KelimeTemaApi = {
          id: t.id ?? t.Id,
          aciklama: t.aciklama ?? t.Aciklama,
          temaId: t.temaId ?? t.TemaId,
          kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
          detayResimUrls: t.detayResimUrls ?? t.DetayResimUrls ?? [],
          kelimeler: (t.kelimeler ?? t.Kelimeler)?.map((k: any) => ({
            id: k.id ?? k.Id,
            ispanyolca: k.ispanyolca ?? k.Ispanyolca,
            turkce: k.turkce ?? k.Turkce,
          })),
        };

        setTema(mappedTema);

        // ===============================
        // 2) Ana tema başlığı API isteği
        // ===============================
        try {
          const temaRes = await api.get(`/tema/${mappedTema.temaId}`);
          const anaTema: TemaApi = temaRes.data;
          setTemaBaslik(anaTema.baslik);
        } catch (error: any) {
          message.warning("Tema başlığı yüklenemedi!");
          console.error(error);
        }

      } catch (err) {
        message.error("Beklenmeyen bir hata oluştu!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);


  // ================================
  // 📌 Kopyalama fonksiyonu
  // ================================
  const copyToClipboard = async (text: string, wordId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWord(wordId);
      setTimeout(() => setCopiedWord(null), 1500);
    } catch (error) {
      message.error("Kopyalama başarısız!");
    }
  };

  const getImageUrl = (url?: string) =>
    !url
      ? "/api/placeholder/300/200?text=Resim+Yok"
      : url.startsWith("http")
      ? url
      : `http://localhost:5001${url}`;


  // ================================
  // 📌 DURUMLAR
  // ================================
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="kelime-loading">
          <Spin size="large" />
          <p>Kelimeler yükleniyor...</p>
        </main>
      </>
    );
  }

  if (!tema) {
    return (
      <>
      
        <Navbar />
        <main className="kelime-error">
          <h2>Tema bulunamadı</h2>
          <p>Geçerli bir tema seçin.</p>
          <Link to="/kelimeler">
            <Button icon={<ArrowLeftOutlined />}>Temalara Dön</Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
    {tema && (
  <Helmet>
    <title>
      {temaBaslik
        ? `${temaBaslik}: İspanyolca'da günlük hayatta kullanılan kelimeler ve cümle içerisindeki kullanımları | Españolize`
        : "İspanyolca'da günlük hayatta kullanılan kelimeler ve cümle içerisindeki kullanımları | Españolize"}
    </title>
    <meta
      name="description"
      content={tema.aciklama ?? "Her kelimeye Türkçe karşılığıyla hızlı ve eğlenceli şekilde erişin."}
    />
    <meta property="og:title" content={temaBaslik ?? "Kelime Teması"} />
    <meta property="og:description" content={tema.aciklama ?? ""} />
    {tema.kapakResmiUrl && (
      <meta property="og:image" content={getImageUrl(tema.kapakResmiUrl)} />
    )}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`http://localhost:5173/kelimeler/${id}`} />
  </Helmet>
)}
      <Navbar />

      <main className="kelime-detail-container">
        <header>
          <h1 className="kelime-detail-title">{temaBaslik}</h1>
          <p className="kelime-detail-aciklama">{tema.aciklama}</p>
        </header>

        <section className="kelimeler-section">
          <div className="kelimeler-list">
            {tema.kelimeler.map((kelime, index) => (
              <div key={kelime.id}>
                <div className="kelime-item">
                  <div className="kelime-text">
                    <span className="kelime-es">{kelime.ispanyolca}</span>
                    <span className="kelime-tr">{kelime.turkce}</span>
                  </div>

                  <button
                    className={`copy-btn ${
                      copiedWord === kelime.id ? "copied" : ""
                    }`}
                    onClick={() =>
                      copyToClipboard(kelime.ispanyolca, kelime.id)
                    }
                  >
                    <CopyOutlined />
                  </button>

                  {copiedWord === kelime.id && (
                    <div className="copy-feedback">Kopyalandı!</div>
                  )}
                </div>

                
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
