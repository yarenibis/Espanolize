import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";
import api from "../../../services/ApiService";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
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

  /* ---------------------- VERİ YÜKLEME ---------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        let baseItems: any[] = [];

        try {
          // 1) Listeyi çek
          const res = await api.get("/metinTema");
          baseItems = res.data ?? [];
        } catch (e) {
          console.error("Liste yüklenirken hata:", e);
          baseItems = [];
        }

        // 2) Her item için detay API çektik
        const detailed = await Promise.all(
          baseItems.map(async (item: any) => {
            try {
              const detail = await api.get(`/metinTema/${item.id}`);

              return {
                id: item.id,
                temaId: item.temaId ?? detail.data.temaId,
                aciklama: item.aciklama ?? detail.data.aciklama,
                kapakResmiUrl: item.kapakResmiUrl ?? detail.data.kapakResmiUrl,
                zorluk:
                  detail.data?.zorluk ??
                  detail.data?.metinler?.[0]?.zorluk ??
                  "Bilinmiyor",
              };
            } catch (innerErr) {
              console.error(`Detay yüklenemedi (ID: ${item.id})`, innerErr);
              return null; // bozuk item atlanır
            }
          })
        );

        const filteredDetailed = detailed.filter((d) => d !== null);

        setTemalar(filteredDetailed as MetinTema[]);

        /* ---- Tema başlıklarını çek ---- */
        let ids: number[] = [];
        try {
          ids = [...new Set(filteredDetailed.map((t: any) => t.temaId))];
        } catch (idErr) {
          console.error("Tema ID listesi oluşturulamadı:", idErr);
          ids = [];
        }

        try {
          const temaResponses = await Promise.all(
            ids.map(async (id) => {
              try {
                const r = await api.get(`/tema/${id}`);
                return {
                  id: r.data?.id ?? id,
                  baslik: r.data?.baslik ?? `Tema ${id}`,
                  kapakResmiUrl: r.data?.kapakResmiUrl,
                };
              } catch (temaErr) {
                console.error(`Tema bilgisi alınamadı (ID: ${id})`, temaErr);
                return {
                  id,
                  baslik: `Tema ${id}`,
                  kapakResmiUrl: undefined,
                };
              }
            })
          );

          setAnaTemalar(temaResponses);
        } catch (outerTemaErr) {
          console.error("Tema başlıkları genel yükleme hatası:", outerTemaErr);
          setAnaTemalar([]);
        }
      } catch (err) {
        console.error("Metin temaları yükleme hatası:", err);
        setTemalar([]);
        setAnaTemalar([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ---------------------- DIFFICULTY CLASS ---------------------- */
  const getDifficultyClass = (level: string) => {
    try {
      if (level === "Kolay") return "difficulty-beginner";
      if (level === "Orta") return "difficulty-intermediate";
      if (level === "Zor") return "difficulty-advanced";
      return "difficulty-unknown";
    } catch {
      return "difficulty-unknown";
    }
  };

  /* ---------------------- TEMA BAŞLIĞI ---------------------- */
  const getTemaBaslik = (id: number) => {
    try {
      const tema = anaTemalar.find((t) => t.id === id);
      return tema?.baslik ?? `Tema ${id}`;
    } catch (e) {
      console.error("Tema başlığı bulunamadı:", e);
      return `Tema ${id}`;
    }
  };

  /* ---------------------- GÖRSEL URL ---------------------- */
  const getImageUrl = (tema: MetinTema) => {
    try {
      const found = anaTemalar.find((t) => t.id === tema.temaId);
      const url = found?.kapakResmiUrl ?? tema.kapakResmiUrl;

      return url?.startsWith("http")
        ? url
        : url
        ? `http://localhost:5001${url}`
        : "/api/placeholder/400/250?text=Resim+Yok";
    } catch (e) {
      console.error("Görsel URL hesaplanamadı:", e);
      return "/api/placeholder/400/250?text=Resim+Yok";
    }
  };

  /* ---------------------- ARAMA FİLTRESİ ---------------------- */
  let filtered: MetinTema[] = [];
  try {
    filtered = temalar.filter((tema) =>
      `${getTemaBaslik(tema.temaId)} ${tema.aciklama}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  } catch (fErr) {
    console.error("Arama filtresi hata verdi:", fErr);
    filtered = [];
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <main className="metin-page">
      <Navbar />

      <header className="metin-header">
        <h1>Metin Temaları</h1>
        <p>
          İspanyolca okuma becerini geliştirmek için tema bazlı metinleri
          keşfet.
        </p>
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
          filtered.map((tema) => {
            try {
              return (
                <article
                  className="metin-card"
                  key={tema.id}
                  onClick={() => {
                    try {
                      navigate(`/metinler/${tema.id}`);
                    } catch (navErr) {
                      console.error("Navigate hata:", navErr);
                    }
                  }}
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
              );
            } catch (cardErr) {
              console.error("Kart render edilemedi:", cardErr);
              return null;
            }
          })}
      </section>

      <Footer />
    </main>
  );
}
