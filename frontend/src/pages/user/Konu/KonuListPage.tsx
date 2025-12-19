import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import "./KonuListPage.css";
import Footer from "../Home/Footer";
import { Helmet } from "react-helmet-async";

import {
  getKonular,
  type KonuListItem,
} from "../../../services/user/KonuService";

export default function KonuListPage() {
  const [konular, setKonular] = useState<KonuListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKonular = async () => {
      try {
        setLoading(true);
        const data = await getKonular();
        setKonular(data);
      } catch (error) {
        console.error("Konular yüklenirken hata:", error);
        setErrorMsg("Konular yüklenirken bir hata oluştu.");
        setKonular([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKonular();
  }, []);

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

  const filteredKonular = konular.filter((konu) =>
    `${konu.baslik} ${konu.aciklama}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>
          İspanyolca Gramer Konuları | Seviyene Göre Öğren | Españolize
        </title>
        <meta
          name="description"
          content="İspanyolca gramer konularını kolaydan zora sıralı şekilde öğrenin. Ser ve estar, zamanlar, fiiller ve daha fazlası örneklerle."
        />
        <meta
          property="og:title"
          content="İspanyolca Gramer Konuları | Españolize"
        />
        <meta
          property="og:description"
          content="İspanyolca gramer konularını seviyene uygun şekilde keşfet."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:5173/konular" />
      </Helmet>

      <main className="konu-page">
        <Navbar />

        <header className="konu-header">
          <h1>İspanyolca Konuları</h1>
          <p>
            Seviyene uygun gramer konularını keşfet ve öğrenmeni hızlandır.
          </p>
        </header>

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

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Konular yükleniyor…</p>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="empty-box">
            <p>{errorMsg}</p>
          </div>
        )}

        {!loading && filteredKonular.length === 0 && (
          <div className="empty-box">
            <p>Arama sonucu bulunamadı.</p>
          </div>
        )}

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
                    alt={`${konu.baslik} – İspanyolca gramer konuları`}
                    loading="lazy"
                  />
                  <span
                    className={`difficulty-badge ${getDifficultyBadge(
                      konu.zorluk
                    )}`}
                  >
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

        <Footer />
      </main>
    </>
  );
}
