import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Button, message } from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import "./KelimeTemaDetailPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { Helmet } from "react-helmet-async";

import KelimeService, {
  type KelimeTemaDetay,
  type Tema,
} from "../../../services/user/KelimeService";

export default function KelimeTemaDetailPage() {
  const { id } = useParams();

  const [tema, setTema] = useState<KelimeTemaDetay | null>(null);
  const [temaBaslik, setTemaBaslik] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [copiedWord, setCopiedWord] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔹 Kelime tema detayı
        const temaDetay = await KelimeService.getKelimeTemaDetay(id!);
        setTema(temaDetay);

        // 🔹 Ana tema başlığı
        try {
          const anaTema: Tema = await KelimeService.getTemaById(
            temaDetay.temaId
          );
          setTemaBaslik(anaTema.baslik);
        } catch (err) {
          message.warning("Tema başlığı yüklenemedi!");
          console.error(err);
        }
      } catch (err) {
        message.error("Kelime teması yüklenirken hata oluştu!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ================================
  // 📌 Kopyalama
  // ================================
  const copyToClipboard = async (text: string, wordId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWord(wordId);
      setTimeout(() => setCopiedWord(null), 1500);
    } catch {
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
      <Helmet>
        <title>
          {temaBaslik
            ? `${temaBaslik}: İspanyolca'da günlük hayatta kullanılan kelimeler | Españolize`
            : "İspanyolca Kelimeler | Españolize"}
        </title>
        <meta
          name="description"
          content={
            tema.aciklama ??
            "Her kelimeye Türkçe karşılığıyla hızlı ve eğlenceli şekilde erişin."
          }
        />
        <meta property="og:title" content={temaBaslik ?? "Kelime Teması"} />
        <meta property="og:description" content={tema.aciklama ?? ""} />
        {tema.kapakResmiUrl && (
          <meta
            property="og:image"
            content={getImageUrl(tema.kapakResmiUrl)}
          />
        )}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`http://localhost:5173/kelimeler/${id}`}
        />
      </Helmet>

      <Navbar />

      <main className="kelime-detail-container">
        <header>
          <h1 className="kelime-detail-title">{temaBaslik}</h1>
          <p className="kelime-detail-aciklama">{tema.aciklama}</p>
        </header>

        <section className="kelimeler-section">
          <div className="kelimeler-list">
            {tema.kelimeler.map((kelime) => (
              <div key={kelime.id} className="kelime-item">
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
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
