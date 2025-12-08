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
  zorluk: "Kolay" | "Orta" | "Zor" | "Bilinmiyor";
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
      // 1) /metinTema ile sadece temel liste (id, temaId, aciklama) geliyor
      const res = await api.get("/metinTema");

      // 2) Listedeki her item için detay API çağrısı
      const detailed = await Promise.all(
        res.data.map(async (item: any) => {
          const detail = await api.get(`/metinTema/${item.id}`);

          return {
            id: item.id,
            temaId: item.temaId ?? detail.data.temaId,
            aciklama: item.aciklama ?? detail.data.aciklama,
            kapakResmiUrl: item.kapakResmiUrl ?? detail.data.kapakResmiUrl,
            zorluk:
              detail.data.zorluk ??
              detail.data.metinler?.[0]?.zorluk ??
              "Bilinmiyor",
          };
        })
      );

      setTemalar(detailed);

      // === Tema başlıklarını çek ===
      const ids = [...new Set(detailed.map(t => t.temaId))];
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


  const getDifficultyClass = (level: string) => {
  if (level === "Kolay") return "difficulty-beginner";
  if (level === "Orta") return "difficulty-intermediate";
  if (level === "Zor") return "difficulty-advanced";
  return "difficulty-unknown";
};

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
                <span className={`difficulty-badge ${getDifficultyClass(tema.zorluk)}`}>
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
  );
}
