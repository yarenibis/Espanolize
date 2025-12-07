import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KelimeTemaListPage.css";
import Footer from "../../components/Footer";

interface KelimeTema {
  id: number;
  aciklama: string;
  temaId: number;
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

export default function KelimeTemaListPage() {
  const [temalar, setTemalar] = useState<KelimeTema[]>([]);
  const [anaTemalar, setAnaTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [temaRes, anaTemaRes] = await Promise.all([
          api.get("/kelimetemalari"),
          api.get("/tema")
        ]);

        setTemalar(temaRes.data);
        setAnaTemalar(anaTemaRes.data);
      } catch (err) {
        console.error("Veriler yüklenemedi", err);
        setTemalar([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Tema başlığını bul
  const getTemaBaslik = (id: number) => {
    const tema = anaTemalar.find(t => t.id === id);
    return tema?.baslik ?? `Tema ${id}`;
  };

  const getImageUrl = (tema: KelimeTema) => {
    const found = anaTemalar.find(t => t.id === tema.temaId);
    const url = found?.kapakResmiUrl ?? tema.kapakResmiUrl;
    return url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/220?text=Resim+Yok";
  };

  const filtered = temalar.filter(t =>
    `${getTemaBaslik(t.temaId)} ${t.aciklama}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="tema-page">
      <Navbar />

      <header className="tema-header">
        <h1>Kelime Temaları</h1>
        <p>İspanyolca kelimeleri tema bazlı şekilde öğren.</p>
      </header>

      <section className="tema-search">
        <input
          type="search"
          placeholder="Tema ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Yükleniyor…</p>
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
                <img src={getImageUrl(tema)} alt="tema" />
              </div>

              <div className="card-body">
                <h2>{getTemaBaslik(tema.temaId)}</h2>
                <p>{tema.aciklama}</p>

                <div className="meta">
                  <span>
                    <BookOutlined /> {tema.kelimeSayisi} kelime
                  </span>
                </div>
              </div>
            </article>
          ))}
      </section>

      <Footer />
    </main>
  );
}
