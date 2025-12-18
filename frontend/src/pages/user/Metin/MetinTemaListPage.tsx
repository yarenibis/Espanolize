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
      try {
        const metinTemalari = await MetinService.getMetinTemalari();
        setTemalar(metinTemalari);

        const temaIds = metinTemalari.map((t) => t.temaId);
        const temaList = await MetinService.getTemalarByIds(temaIds);
        setAnaTemalar(temaList);
      } catch (err) {
        console.error("Metin temaları yüklenemedi:", err);
        setTemalar([]);
        setAnaTemalar([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ---------------- YARDIMCI FONKSİYONLAR ---------------- */
  const getTemaBaslik = (id: number) =>
    anaTemalar.find((t) => t.id === id)?.baslik ?? `Tema ${id}`;

  const getImageUrl = (tema: MetinTema) => {
    const found = anaTemalar.find((t) => t.id === tema.temaId);
    const url = found?.kapakResmiUrl ?? tema.kapakResmiUrl;

    return url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/250?text=Resim+Yok";
  };

  const getDifficultyClass = (level: string) => {
    if (level === "Kolay") return "difficulty-beginner";
    if (level === "Orta") return "difficulty-intermediate";
    if (level === "Zor") return "difficulty-advanced";
    return "difficulty-unknown";
  };

  const filtered = temalar.filter((tema) =>
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
        <meta property="og:title" content="Metin Temaları | Espanolize" />
        <meta
          property="og:description"
          content="Tema bazlı İspanyolca okuma metinleri."
        />
        <meta property="og:url" content="http://localhost:5173/metinTema" />
      </Helmet>

      <main className="metin-page">
        <Navbar />

        <header className="metin-header">
          <h1>Metin Temaları</h1>
          <p>İspanyolca okuma becerini geliştirmek için tema bazlı metinleri keşfet.</p>
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
            <div className="spinner"></div>
            <p>Metin temaları yükleniyor…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-box">
            <FileTextOutlined style={{ fontSize: "3rem", opacity: 0.4 }} />
            <p>Sonuç bulunamadı.</p>
          </div>
        )}

        <section className="metin-grid">
          {!loading &&
            filtered.map((tema) => (
              <article
                key={tema.id}
                className="metin-card"
                onClick={() => navigate(`/metinler/${tema.id}`)}
              >
                <div className="card-image-wrapper">
                  <img
                    src={getImageUrl(tema)}
                    alt={`${getTemaBaslik(tema.temaId)} – İspanyolca okuma`}
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
