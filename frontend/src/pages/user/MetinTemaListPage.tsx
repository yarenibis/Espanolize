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

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

export default function MetinTemaListPage() {
  const [temalar, setTemalar] = useState<MetinTema[]>([]);
  const [anaTemalar, setAnaTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/metinTema");

        const normalized: MetinTema[] = res.data.map((t: any) => ({
          id: t.id ?? t.Id,
          temaId: t.temaId ?? t.TemaId,
          aciklama: t.aciklama ?? t.Aciklama,
          kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
        }));

        setTemalar(normalized);

        // === Tema başlıklarını çek ===
        const ids = [...new Set(normalized.map(t => t.temaId))]; // benzersiz ID'ler

        const temaResponses = await Promise.all(ids.map(id => api.get(`/tema/${id}`)));
        const temaList = temaResponses.map(r => ({
          id: r.data.id,
          baslik: r.data.baslik,
          kapakResmiUrl: r.data.kapakResmiUrl
        }));

        setAnaTemalar(temaList);

      } catch (err) {
        console.error("Metin temaları yüklenemedi:", err);
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

  // Görsel önce Tema tablosundan, yoksa metinTema’dan
  const getImageUrl = (tema: MetinTema) => {
    const found = anaTemalar.find(t => t.id === tema.temaId);
    const url = found?.kapakResmiUrl ?? tema.kapakResmiUrl;

    return url?.startsWith("http")
      ? url
      : url
      ? `http://localhost:5001${url}`
      : "/api/placeholder/400/250?text=Resim+Yok";
  };

  const filtered = temalar.filter((tema) =>
    `${getTemaBaslik(tema.temaId)} ${tema.aciklama}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <main className="metin-page">
      <Navbar />

      <header className="metin-header">
        <h1>Metin Temaları</h1>
        <p>İspanyolca okuma becerini geliştirmek için tema bazlı metinleri keşfet.</p>
      </header>

      <section className="search-wrapper">
        <input
          type="search"
          placeholder="Metin teması ara… (örn: kültür, hikaye)"
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
              className="metin-card"
              key={tema.id}
              onClick={() => navigate(`/metinler/${tema.id}`)}
            >
              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(tema)}
                  alt={getTemaBaslik(tema.temaId)}
                  loading="lazy"
                />
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
  );
}
