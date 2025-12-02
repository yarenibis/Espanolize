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

  /* -------- SEO OPTİMİZASYONU -------- */
  useEffect(() => {
    if (!tema) return;

    document.title = `Tema ${tema.temaId} • İspanyolca Okuma Metinleri`;

    const desc = document.querySelector('meta[name=description]') || document.createElement("meta");
    desc.setAttribute("name", "description");
    desc.setAttribute("content", tema.aciklama.slice(0, 150));
    document.head.appendChild(desc);

    const kw = document.querySelector('meta[name=keywords]') || document.createElement("meta");
    kw.setAttribute("name", "keywords");
    kw.setAttribute(
      "content",
      `ispanyolca okuma metinleri, tema ${tema.temaId}, ispanyolca metinler, ispanyolca çalışma, kısa ispanyolca metin`
    );
    document.head.appendChild(kw);
  }, [tema]);

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

  return (
    <>
      <Navbar />

      <main className="metin-container">
        <header >
          <h1 className="tema-title">Tema {tema.temaId}</h1>
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
