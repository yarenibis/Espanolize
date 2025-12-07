import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/ApiService";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
import "./MetinTemaDetailPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

export default function MetinTemaDetailPage() {
  const { id } = useParams();
  const [tema, setTema] = useState<MetinTemaDetay | null>(null);
  const [temaBaslik, setTemaBaslik] = useState<string>("");
  const [loading, setLoading] = useState(true);

  /* ----------- VERİ YÜKLEME ----------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/metinTema/${id}`);
        const data = res.data;

        const mapped: MetinTemaDetay = {
          id: data.id,
          aciklama: data.aciklama,
          temaId: data.temaId,
          metinler: data.metinler ?? []
        };

        setTema(mapped);

        // ---- Tema başlığını çek ----
        const temaRes = await api.get(`/tema/${mapped.temaId}`);
        setTemaBaslik(temaRes.data.baslik);

      } catch (err) {
        console.error("Tema yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* -------- SEO -------- */
  useEffect(() => {
    if (!tema) return;

    document.title = `${temaBaslik} • İspanyolca Okuma Metinleri`;

    const desc = document.querySelector('meta[name=description]') || document.createElement("meta");
    desc.setAttribute("name", "description");
    desc.setAttribute("content", tema.aciklama.slice(0, 150));
    document.head.appendChild(desc);
  }, [tema, temaBaslik]);

  /* -------- DURUMLAR -------- */
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

  /* -------- ANA TASARIM -------- */
  return (
    <>
      <Navbar />

      <main className="metin-container">
        <header>
          <h1 className="tema-title">{temaBaslik}</h1>
          <p className="tema-aciklama">{tema.aciklama}</p>
        </header>

        <section className="metin-list">
          {tema.metinler.map((metin) => (
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
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
