import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KelimeTemaListPage.css";
import Footer from "../../components/Footer";

interface KelimeTema {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

export default function KelimeTemaListPage() {
  const [temalar, setTemalar] = useState<KelimeTema[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/kelimetemalari");
        setTemalar(
          data.map((t: any) => ({
            id: t.id ?? t.Id,
            baslik: t.baslik ?? t.Baslik,
            aciklama: t.aciklama ?? t.Aciklama,
            kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
            kelimeSayisi: t.kelimeSayisi ?? t.KelimeSayisi ?? 20,
            zorluk: t.zorluk ?? t.Zorluk ?? "Kolay",
          }))
        );
      } catch {
        setTemalar([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = temalar.filter((t) =>
    `${t.baslik} ${t.aciklama}`.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (url?: string) =>
    url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/220?text=Resim+Yok";

  const badgeClass = (z: string) =>
    z === "Kolay"
      ? "badge-beginner"
      : z === "Orta"
      ? "badge-intermediate"
      : "badge-advanced";

  return (
    <main className="tema-page">
      <Navbar />

      <header className="tema-header">
        <h1>Kelime Temaları</h1>
        <p>İspanyolca kelime dağarcığını geliştirmek için kategori temelli içerikler.</p>
      </header>

      <section className="tema-search">
        <input
          type="search"
          placeholder="Tema ara… (örn: yiyecekler)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Temalar yükleniyor…</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-box">
          <p>Sonuç bulunamadı.</p>
        </div>
      )}

      <section className="tema-grid">
        {!loading &&
          filtered.map((tema) => (
            <article
              key={tema.id}
              className="tema-card"
              onClick={() => navigate(`/kelimeler/${tema.id}`)}
            >
              <div className="card-img">
                <img
                  src={getImageUrl(tema.kapakResmiUrl)}
                  alt={`${tema.baslik} teması`}
                  loading="lazy"
                />
                <span className={`badge ${badgeClass(tema.zorluk)}`}>
                  {tema.zorluk}
                </span>
              </div>

              <div className="card-body">
                <h2>{tema.baslik}</h2>
                <p>{tema.aciklama}</p>

                <div className="meta">
                  <span>
                    <BookOutlined /> {tema.kelimeSayisi} kelime
                  </span>
                  <span>
                    <UserOutlined /> {tema.zorluk}
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
