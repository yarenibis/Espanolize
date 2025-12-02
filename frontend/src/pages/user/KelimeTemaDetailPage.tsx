import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import "./KelimeTemaDetailPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
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
    api
      .get(`/kelimetemalari/${id}`)
      .then((res) => {
        const t = res.data;

        setTema({
          id: t.id ?? t.Id,
          aciklama: t.aciklama ?? t.Aciklama,
          temaId: t.temaId ?? t.TemaId,
          kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
          detayResimUrls: t.detayResimUrls ?? t.DetayResimUrls ?? [],
          kelimeler:
            (t.kelimeler ?? t.Kelimeler)?.map((k: any) => ({
              id: k.id ?? k.Id,
              ispanyolca: k.ispanyolca ?? k.Ispanyolca,
              turkce: k.turkce ?? k.Turkce,
            })) ?? [],
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ⭐ SEO – Helmet YOK, tarayıcı başlık/meta güncellemesi
  useEffect(() => {
    if (!tema) return;

    document.title = `Kelime Teması ${tema.temaId} • Espanolize`;

    const descText = tema.aciklama.slice(0, 150);

    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", descText);

    let kw = document.querySelector('meta[name="keywords"]');
    if (!kw) {
      kw = document.createElement("meta");
      kw.setAttribute("name", "keywords");
      document.head.appendChild(kw);
    }
    kw.setAttribute(
      "content",
      `İspanyolca kelime teması, kelime listesi, ispanyolca öğren, tema ${tema.temaId}`
    );
  }, [tema]);

  const getImageUrl = (url: string | null | undefined) =>
    !url
      ? "/api/placeholder/300/200?text=Resim+Yok"
      : url.startsWith("http")
      ? url
      : `http://localhost:5001${url}`;

  const copyToClipboard = (text: string, wordId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedWord(wordId);
      setTimeout(() => setCopiedWord(null), 1500);
    });
  };

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
      <Navbar />

      <main className="kelime-detail-container">
        <header >
          <h1 className="tema-title">Tema {tema.temaId}</h1>
          <p className="tema-aciklama">{tema.aciklama}</p>
        </header>

        <section className="kelimeler-section">
          <div className="kelimeler-list">
            {tema.kelimeler.map((kelime, index) => (
              <div key={kelime.id}>
                {/* Kelime Kartı */}
                <div className="kelime-item">
                  <div className="kelime-text">
                    <span className="kelime-es">{kelime.ispanyolca}</span>
                    <span className="kelime-tr">{kelime.turkce}</span>
                  </div>

                  <button
                    className={`copy-btn ${
                      copiedWord === kelime.id ? "copied" : ""
                    }`}
                    onClick={() => copyToClipboard(kelime.ispanyolca, kelime.id)}
                  >
                    <CopyOutlined />
                  </button>

                  {copiedWord === kelime.id && (
                    <div className="copy-feedback">Kopyalandı!</div>
                  )}
                </div>

                {/* Araya serpiştirilen görsel */}
                {tema.detayResimUrls[index] && (
                  <img
                    className="inline-image"
                    src={getImageUrl(tema.detayResimUrls[index])}
                    alt="detay"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
