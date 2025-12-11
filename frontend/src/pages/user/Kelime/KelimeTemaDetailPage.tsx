import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/ApiService";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import "./KelimeTemaDetailPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

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
  kelimeler: any[];
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

  // =============================
  // 🚀 TEMA VE ANA TEMA BİLGİLERİNİ YÜKLE
  // =============================
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Kelime teması bilgisini al
        const res = await api.get(`/kelimetemalari/${id}`);
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

        // 2) Ana temayı al → başlık buradan gelecek!
        const temaRes = await api.get(`/tema/${mappedTema.temaId}`);
        const anaTema: TemaApi = temaRes.data;

        setTemaBaslik(anaTema.baslik);

      } catch (err) {
        console.error("Tema yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // =============================
  // 📌 Kopyalama işlemi
  // =============================
  const copyToClipboard = (text: string, wordId: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedWord(wordId);
      setTimeout(() => setCopiedWord(null), 1500);
    });
  };

  const getImageUrl = (url?: string) =>
    !url
      ? "/api/placeholder/300/200?text=Resim+Yok"
      : url.startsWith("http")
      ? url
      : `http://localhost:5001${url}`;

  // =============================
  // 📌 SAYFA DURUMLARI
  // =============================
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

  // =============================
  // 📌 ASIL TASARIM
  // =============================
  return (
    <>
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

                {tema.detayResimUrls && tema.detayResimUrls[index] && (
                  <img
                    className="inline-image"
                    src={getImageUrl(tema.detayResimUrls[index])}
                    alt="detay"
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
