import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOutlined } from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import api from "../../../services/ApiService";
import "./KelimeTemaListPage.css";
import Footer from "../Home/Footer";
import { message } from "antd";
import { Helmet } from "react-helmet-async";

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
        let temaRes, anaTemaRes;

        // ===========================
        // 1) Kelime temaları isteği
        // ===========================
        try {
          temaRes = await api.get("/kelimetemalari");
        } catch (err) {
          message.error("Kelime temaları yüklenemedi.");
          console.error(err);
          setTemalar([]);
        }

        // ===========================
        // 2) Ana temalar isteği
        // ===========================
        try {
          anaTemaRes = await api.get("/tema");
        } catch (err) {
          message.error("Ana tema listesi yüklenemedi.");
          console.error(err);
          setAnaTemalar([]);
        }

        // Listeleri doldur
        if (temaRes?.data) setTemalar(temaRes.data);
        if (anaTemaRes?.data) setAnaTemalar(anaTemaRes.data);

      } catch (err) {
        // En üst seviye beklenmedik hata
        message.error("Beklenmeyen bir hata oluştu!");
        console.error("HATA:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getTemaBaslik = (id: number) => {
    try {
      const tema = anaTemalar.find((t) => t.id === id);
      return tema?.baslik ?? `Tema ${id}`;
    } catch {
      return `Tema ${id}`;
    }
  };

  const getImageUrl = (tema: KelimeTema) => {
    try {
      const found = anaTemalar.find((t) => t.id === tema.temaId);
      const url = found?.kapakResmiUrl ?? tema.kapakResmiUrl;

      return url?.startsWith("http")
        ? url
        : url
        ? `http://localhost:5001${url}`
        : "/api/placeholder/400/220?text=Resim+Yok";
    } catch {
      return "/api/placeholder/400/220?text=Hata";
    }
  };

  const filtered = temalar.filter((t) =>
    `${getTemaBaslik(t.temaId)} ${t.aciklama}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
   <Helmet>
    <title>
      İspanyolca Kelime Temaları | Tema Bazlı Kolay İspanyolca Öğrenme | Españolize
    </title>

    <meta
      name="description"
      content="İspanyolca kelimeleri tema bazlı öğrenin. Aile, yemekler, hayvanlar, günlük konuşma ve daha fazlası. Türkçe karşılıklarıyla hızlı ve etkili öğrenme."
    />

    {/* Open Graph */}
    <meta
      property="og:title"
      content="İspanyolca Kelime Temaları | Españolize"
    />
    <meta
      property="og:description"
      content="İspanyolca kelimeleri tema bazlı öğrenin. Günlük hayatta en çok kullanılan kelimeleri Türkçe karşılıklarıyla keşfedin."
    />
    <meta
      property="og:type"
      content="website"
    />
    <meta
      property="og:url"
      content="http://localhost:5173/kelimetemalari"
    />

    
  </Helmet>
    
    <main className="kelime-tema-page">
      <Navbar />

      <header className="kelime-tema-header">
        <h1>Kelime Temaları</h1>
        <p>İspanyolca kelimeleri tema bazlı şekilde öğren.</p>
      </header>

      {/* Arama kutusu */}
      <section className="tema-search">
        <input
          type="search"
          placeholder="Tema ara… (örn: Aile, Hayvanlar, Yemekler)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Tema arama"
        />
      </section>

      {/* Loading */}
      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Temalar yükleniyor…</p>
        </div>
      )}

      {/* Boş sonuç */}
      {!loading && filtered.length === 0 && (
        <div className="empty-box">
          <p>Aradığın tema bulunamadı.</p>
        </div>
      )}

      {/* Tema grid */}
      <section className="tema-grid">
        {!loading &&
          filtered.map((tema) => (
            <article
              key={tema.id}
              className="tema-card"
              onClick={() => navigate(`/kelimeler/${tema.id}`)}
            >
              <div className="card-img">
                <img src={getImageUrl(tema)} alt={getTemaBaslik(tema.temaId)} />
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
    </>
  );
}
