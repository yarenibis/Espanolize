import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import MetinService, {
  type MetinTema,
  type Tema,
} from "../../../services/user/MetinService";
import "./MetinTemaListPage.css";
import { Helmet } from "react-helmet-async";

export default function MetinTemaListPage() {
  const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [anaTemalar, setAnaTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  /* ---------------- VERİ YÜKLEME ---------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const metinTemalari = await MetinService.getMetinTemalari();
        setTemalar(metinTemalari);

        const temaIds = metinTemalari.map((t) => t.temaId);
        const temaList = await MetinService.getTemalarByIds(temaIds);
        setAnaTemalar(temaList);
      } catch (error) {
        console.error("Metin temaları yüklenemedi:", error);
        setTemalar([]);
        setAnaTemalar([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ---------------- YARDIMCI FONKSİYONLAR ---------------- */
  const getTemaBaslik = (temaId: number): string =>
    anaTemalar.find((t) => t.id === temaId)?.baslik ?? `Tema ${temaId}`;

  const getImageUrl = (tema: MetinTema): string => {
    const anaTema = anaTemalar.find((t) => t.id === tema.temaId);
    const url = anaTema?.kapakResmiUrl ?? tema.kapakResmiUrl;

    if (!url) return "/api/placeholder/400/250?text=Resim+Yok";
    return url.startsWith("http") ? url : `http://localhost:5001${url}`;
  };

  const getDifficultyClass = (level: MetinTema["zorluk"]) => {
    switch (level) {
      case "Kolay":
        return "difficulty-beginner";
      case "Orta":
        return "difficulty-intermediate";
      case "Zor":
        return "difficulty-advanced";
      default:
        return "difficulty-unknown";
    }
  };

  const filteredTemalar = temalar.filter((tema) =>
    `${getTemaBaslik(tema.temaId)} ${tema.aciklama}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <Helmet>
        <title>Metin Temaları | İspanyolca Okuma | Espanolize</title>
        <meta
          name="description"
          content="İspanyolca okuma becerini geliştirmek için tema bazlı metinleri keşfet."
        />
      </Helmet>

      <main className="metin-page">
        <Navbar />

        <header className="metin-header">
          <h1>Metin Temaları</h1>
          <p>
            İspanyolca okuma becerini geliştirmek için tema bazlı metinleri keşfet.
          </p>
        </header>

        <section className="search-wrapper">
          <input
            type="search"
            placeholder="Metin teması ara…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </section>

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <p>Metin temaları yükleniyor…</p>
          </div>
        )}

        {!loading && filteredTemalar.length === 0 && (
          <div className="empty-box">
            <FileTextOutlined style={{ fontSize: "3rem", opacity: 0.4 }} />
            <p>Sonuç bulunamadı.</p>
          </div>
        )}

        <section className="metin-grid">
          {!loading &&
            filteredTemalar.map((tema) => (
              <article
                key={tema.id}
                className="metin-card"
                onClick={() => navigate(`/metinler/${tema.id}`)}
              >
                <div className="card-image-wrapper">
                  <img
                    src={getImageUrl(tema)}
                    alt={getTemaBaslik(tema.temaId)}
                    loading="lazy"
                  />
                  <span
                    className={`difficulty-badge ${getDifficultyClass(
                      tema.zorluk
                    )}`}
                  >
                    {tema.zorluk}
                  </span>
                </div>

                <div className="card-body">
                  <h2>{getTemaBaslik(tema.temaId)}</h2>
                  <p>{tema.aciklama}</p>
                </div>
              </article>
            ))}
        </section>

        <Footer />
      </main>
    </>
  );
}
