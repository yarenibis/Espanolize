import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/ApiService";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
import "./MetinTemaDetailPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";

interface Metin {
  id: number;
  baslik: string;
  icerik: string;
  ceviri: string;
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
  const [temaBaslik, setTemaBaslik] = useState<string>("");
  const [loading, setLoading] = useState(true);

  /* ---------------- VERİ YÜKLEME ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // ---- METİN TEMA DETAYI ÇEK ----
        const res = await api.get(`/metinTema/${id}`);
        const data = res.data;

        const mapped: MetinTemaDetay = {
          id: data.id,
          aciklama: data.aciklama,
          temaId: data.temaId,
          metinler: Array.isArray(data.metinler) ? data.metinler : []
        };

        setTema(mapped);

        // ---- Tema başlığını çek ----
        try {
          const temaRes = await api.get(`/tema/${mapped.temaId}`);
          setTemaBaslik(temaRes.data?.baslik ?? "Bilinmeyen Tema");
        } catch (innerErr) {
          console.error("Tema başlığı çekilirken hata:", innerErr);
          setTemaBaslik("Bilinmeyen Tema");
        }

      } catch (err) {
        console.error("Tema yüklenemedi:", err);
        setTema(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ---------------- SEO ---------------- */
  useEffect(() => {
    if (!tema) return;

    try {
      document.title = `${temaBaslik} • İspanyolca Okuma Metinleri`;

      let desc =
        document.querySelector('meta[name="description"]') ||
        document.createElement("meta");

      desc.setAttribute("name", "description");
      desc.setAttribute("content", tema.aciklama.slice(0, 150));
      document.head.appendChild(desc);
    } catch (seoErr) {
      console.error("SEO meta bilgisi ayarlanamadı:", seoErr);
    }
  }, [tema, temaBaslik]);

  /* ---------------- DURUMLAR ---------------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="metin-loading">
          <Spin size="large" />
          <p>Metinler yükleniyor...</p>
        </main>
      </>
    );
  }

  if (!tema) {
    return (
      <>
        <Navbar />
        <main className="metin-error">
          <h2>Tema Bulunamadı</h2>
          <p>Geçerli bir metin teması seçin.</p>
          <Link to="/metinler">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Geri Dön
            </Button>
          </Link>
        </main>
      </>
    );
  }

  /* ---------------- ANA TASARIM ---------------- */
  return (
    <>
      <Navbar />

      <main className="metin-container">
        <header>
          <h1 className="metin-detail-title">{temaBaslik}</h1>
          <p className="metin-detail-aciklama">{tema.aciklama}</p>
        </header>

        <section className="metin-list">
          {tema.metinler.map((metin) => {
            try {
              return (
                <article key={metin.id} className="metin-item">
                  <header className="metin-header-static">
                    <FileTextOutlined className="metin-header-icon" />
                    <div>
                      <h2 className="metin-baslik">{metin.baslik}</h2>
                      <p className="metin-aciklama">{metin.aciklama}</p>
                    </div>
                  </header>

                  <div className="metin-icerik-static">
                    <p className="metin-yazi">{metin.icerik}</p>
                  </div>

                  <div className="metin-icerik-static">
                    <p className="metin-yazi">{metin.ceviri}</p>
                  </div>
                </article>
              );
            } catch (mapErr) {
              console.error("Metin render edilirken hata:", mapErr);
              return null; // UI kırılmaz
            }
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}
