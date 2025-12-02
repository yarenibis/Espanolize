import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import api from "../../services/ApiService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./MetinTemaListPage.css";

interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
}

export default function MetinTemaListPage() {
  const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemalar = async () => {
      try {
        const res = await api.get("/metinTema");
        const normalized = res.data.map((t: any) => ({
          id: t.id ?? t.Id,
          temaId: t.temaId ?? t.TemaId,
          aciklama: t.aciklama ?? t.Aciklama,
          kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl
        }));

        setTemalar(normalized);
      } catch {
        setTemalar([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemalar();
  }, []);

  const filtered = temalar.filter((tema) =>
    `${tema.aciklama} ${tema.temaId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const navigateToTema = (id: number) => navigate(`/metinler/${id}`);

  const getImageUrl = (url?: string) =>
    url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/250?text=Resim+Yok";

  return (
    <main className="metin-page">
      <Navbar />

      {/* === SEO Header === */}
      <header className="metin-header">
        <h1>Metin Temaları</h1>
        <p>
          İspanyolca okuma becerini geliştirmek için tema bazlı metinleri keşfet.
        </p>
      </header>

      {/* === Search === */}
      <section className="search-wrapper">
        <input
          type="search"
          placeholder="Metin teması ara… (örn: kültür, hikaye)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Metin teması arama"
        />
      </section>

      {/* === Loading === */}
      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Metin temaları yükleniyor…</p>
        </div>
      )}

      {/* === Empty === */}
      {!loading && filtered.length === 0 && (
        <div className="empty-box">
          <FileTextOutlined style={{ fontSize: "3rem", opacity: 0.4 }} />
          <p>Sonuç bulunamadı.</p>
        </div>
      )}

      {/* === Grid === */}
      <section className="metin-grid">
        {!loading &&
          filtered.map((tema) => (
            <article
              className="metin-card"
              key={tema.id}
              onClick={() => navigateToTema(tema.id)}
            >
              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(tema.kapakResmiUrl)}
                  alt={`Tema ${tema.temaId} kapak görseli`}
                  loading="lazy"
                />
                <span className="theme-badge">Tema {tema.temaId}</span>
              </div>

              <div className="card-body">
                <h2>Tema {tema.temaId}</h2>
                <p>{tema.aciklama}</p>
              </div>
            </article>
          ))}
      </section>

      <Footer />
    </main>
  );
}
