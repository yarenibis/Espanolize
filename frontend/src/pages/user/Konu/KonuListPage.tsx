import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../../services/ApiService";
import Navbar from "../Home/Navbar";
import "./KonuListPage.css";
import Footer from "../Home/Footer";

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
}

export default function KonuListPage() {
  const [konular, setKonular] = useState<Konu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKonular = async () => {
      try {
        const { data } = await api.get("/konular");
        setKonular(data);
      } catch (error) {
        console.error("Konular yüklenirken hata:", error);
        setKonular([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKonular();
  }, []);

  const filteredKonular = konular.filter((konu) =>
    `${konu.baslik} ${konu.aciklama}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getDifficultyBadge = (level: string) => {
    if (level === "Kolay") return "difficulty-beginner";
    if (level === "Orta") return "difficulty-intermediate";
    return "difficulty-advanced";
  };

  const getImageUrl = (url?: string) =>
    url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/220?text=Resim+Yok";

  return (
    <main className="konu-page">
      <Navbar />

      {/* SEO Başlık */}
      <header className="konu-header">
        <h1>İspanyolca Konuları</h1>
        <p>Seviyene uygun gramer konularını keşfet ve öğrenmeni hızlandır.</p>
      </header>

      {/* Arama Alanı */}
      <section className="search-wrapper">
        <input
          type="search"
          value={searchTerm}
          placeholder="Konu ara… (örn: ser estar, fiiller, zamanlar)"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Konu arama"
        />
      </section>

      {/* Yükleme */}
      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Konular yükleniyor…</p>
        </div>
      )}

      {/* Hiç sonuç yok */}
      {!loading && filteredKonular.length === 0 && (
        <div className="empty-box">
          <p>Arama sonucu bulunamadı.</p>
        </div>
      )}

      {/* Konu Grid */}
      <section className="konu-grid">
        {!loading &&
          filteredKonular.map((konu) => (
            <article
              key={konu.id}
              className="konu-card"
              onClick={() => navigate(`/konular/${konu.id}`)}
            >
              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(konu.kapakResmiUrl)}
                  alt={`${konu.baslik} konusu kapak görseli`}
                  loading="lazy"
                />
                <span className={`difficulty-badge ${getDifficultyBadge(konu.zorluk)}`}>
                  {konu.zorluk}
                </span>
              </div>

              <div className="card-body">
                <h2>{konu.baslik}</h2>
                <p>{konu.aciklama}</p>

                <div className="card-meta">
                  <span>
                    <ClockCircleOutlined /> {konu.calismaSuresi} dk
                  </span>
                  <span>
                    <UserOutlined /> {konu.zorluk}
                  </span>
                </div>
              </div>
            </article>
          ))}
      </section>
      <Footer/>
    </main>
  );
}
