import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined, FileTextOutlined } from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import MetinService, {
  type MetinTemaDetay,
} from "../../../services/user/MetinService";
import "./MetinTemaDetailPage.css";
import { Helmet } from "react-helmet-async";

export default function MetinTemaDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [tema, setTema] = useState<MetinTemaDetay | null>(null);
  const [temaBaslik, setTemaBaslik] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- VERİ YÜKLEME ---------------- */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const temaDetay = await MetinService.getMetinTemaDetay(id);
        setTema(temaDetay);

        const anaTema = await MetinService.getTemaById(temaDetay.temaId);
        setTemaBaslik(anaTema.baslik);
      } catch (error) {
        console.error("Metin tema detayı yüklenemedi:", error);
        setTema(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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
          <Link to="/metinTema">
            <Button icon={<ArrowLeftOutlined />}>Geri Dön</Button>
          </Link>
        </main>
      </>
    );
  }

  /* ---------------- ANA TASARIM ---------------- */
  return (
    <>
      <Helmet>
        <title>{temaBaslik} | İspanyolca Okuma | Espanolize</title>
        <meta
          name="description"
          content={tema.aciklama?.slice(0, 155)}
        />
      </Helmet>

      <Navbar />

      <main className="metin-container">
        <header>
          <h1 className="metin-detail-title">{temaBaslik}</h1>
          <p className="metin-detail-aciklama">{tema.aciklama}</p>
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

              <div className="metin-icerik-static">
                <p className="metin-yazi">{metin.ceviri}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
