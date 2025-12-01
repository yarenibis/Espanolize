import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../services/ApiService";
import "./QuickLinks.css";

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
}

interface KelimeTema {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
}

export default function QuickLinks() {
  const [gramerKonulari, setGramerKonulari] = useState<Konu[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = async () => {
    try {
      setLoading(true);

      const [gramerRes, kelimeRes, metinRes] = await Promise.all([
        api.get("/konular?limit=3"),
        api.get("/kelimetemalari?limit=3"),
        api.get("/metinTema?limit=3"),
      ]);

      setGramerKonulari(normalizeKonular(gramerRes.data));
      setKelimeTemalari(normalizeKelimeTemalari(kelimeRes.data));
      setMetinTemalari(normalizeMetinTemalari(metinRes.data));
    } catch (error) {
      console.error("QuickLinks verileri yüklenirken hata:", error);
      setGramerKonulari([]);
      setKelimeTemalari([]);
      setMetinTemalari([]);
    } finally {
      setLoading(false);
    }
  };

  // Normalize helpers
  const normalizeKonular = (data: any[]): Konu[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      baslik: item.baslik ?? item.Baslik,
      aciklama: item.aciklama ?? item.Aciklama,
      zorluk: (item.zorluk ?? item.Zorluk) || "Kolay",
      calismaSuresi: item.calismaSuresi ?? item.CalismaSuresi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl,
    }));

  const normalizeKelimeTemalari = (data: any[]): KelimeTema[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      baslik: item.baslik ?? item.Baslik,
      aciklama: item.aciklama ?? item.Aciklama,
      zorluk: (item.zorluk ?? item.Zorluk) || "Kolay",
      kelimeSayisi: item.kelimeSayisi ?? item.KelimeSayisi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl,
    }));

  const normalizeMetinTemalari = (data: any[]): MetinTema[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      temaId: item.temaId ?? item.TemaId,
      aciklama: item.aciklama ?? item.Aciklama,
      kapakResmiUrl: item.kapakResmiUrl ?? item.KapakResmiUrl,
    }));

  const getDifficultyColor = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case "kolay":
        return "difficulty-beginner";
      case "orta":
        return "difficulty-intermediate";
      case "zor":
        return "difficulty-advanced";
      default:
        return "difficulty-beginner";
    }
  };

  const getDifficultyText = (zorluk: string) => {
    switch (zorluk.toLowerCase()) {
      case "kolay":
        return "Başlangıç";
      case "orta":
        return "Orta";
      case "zor":
        return "İleri";
      default:
        return zorluk;
    }
  };

  const getImageUrl = (url: string | null | undefined): string => {
    if (!url) {
      return "/api/placeholder/400/250?text=Kapak+görseli+bulunamadı";
    }
    if (url.startsWith("http")) {
      return url;
    }
    return `http://localhost:5001${url}`;
  };

  if (loading) {
    return (
      <section
        className="quick-links-section"
        aria-labelledby="quick-links-heading"
      >
        <div className="container">
          <div className="loading-state" role="status" aria-live="polite">
            <div className="loading-spinner" />
            <p>İspanyolca içerikler yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="quick-links-section"
      aria-labelledby="quick-links-heading"
    >
      <div className="container">
        <header className="quick-links-header">
          <h2 id="quick-links-heading" className="quick-links-title">
            Hızlı erişim: İspanyolca içerikler
          </h2>
          <p className="quick-links-subtitle">
            Gramer, kelime temaları ve okuma metinlerine ana sayfadan hızlıca
            ulaşın.
          </p>
        </header>

        {/* Gramer Konuları */}
        <section
          className="cards-category"
          aria-labelledby="quick-gramer-heading"
        >
          <div className="category-header">
            <div className="category-title">
              <BookOutlined className="category-icon" />
              <h3 id="quick-gramer-heading">Gramer Konuları</h3>
            </div>
            <Link to="/konular" className="view-all-link">
              Tüm gramer konularını gör <span aria-hidden="true">→</span>
            </Link>
          </div>

          {gramerKonulari.length > 0 ? (
            <ul className="cards-grid">
              {gramerKonulari.map((konu) => (
                <li key={konu.id}>
                  <Link
                    to={`/konular/${konu.id}`}
                    className="quick-link-card"
                    aria-label={`${konu.baslik} gramer konusu, seviye: ${getDifficultyText(
                      konu.zorluk
                    )}, ortalama çalışma süresi ${konu.calismaSuresi} dakika`}
                  >
                    <article>
                      <div className="card-cover">
                        <img
                          src={getImageUrl(konu.kapakResmiUrl)}
                          alt={`${konu.baslik} konusu kapak görseli`}
                          className="card-image"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/api/placeholder/400/250?text=Görsel+bulunamadı";
                          }}
                        />
                        <div className="card-overlay">
                          <span
                            className={`difficulty-badge ${getDifficultyColor(
                              konu.zorluk
                            )}`}
                          >
                            {getDifficultyText(konu.zorluk)}
                          </span>
                        </div>
                      </div>

                      <div className="card-content">
                        <h4 className="card-title">{konu.baslik}</h4>
                        <p className="card-description">{konu.aciklama}</p>

                        <div className="card-meta">
                          <div className="meta-item">
                            <ClockCircleOutlined />
                            <span>{konu.calismaSuresi} dk çalışma</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-category">
              <BookOutlined className="empty-icon" />
              <p>Şu anda listelenecek gramer konusu bulunmuyor.</p>
            </div>
          )}
        </section>

        {/* Kelime Temaları */}
        <section
          className="cards-category"
          aria-labelledby="quick-kelime-heading"
        >
          <div className="category-header">
            <div className="category-title">
              <ReadOutlined className="category-icon" />
              <h3 id="quick-kelime-heading">Kelime Temaları</h3>
            </div>
            <Link to="/kelimetemalari" className="view-all-link">
              Tüm kelime temalarını gör <span aria-hidden="true">→</span>
            </Link>
          </div>

          {kelimeTemalari.length > 0 ? (
            <ul className="cards-grid">
              {kelimeTemalari.map((tema) => (
                <li key={tema.id}>
                  <Link
                    to={`/kelimetemalari/${tema.id}`}
                    className="quick-link-card"
                    aria-label={`${tema.baslik} kelime teması, seviye: ${getDifficultyText(
                      tema.zorluk
                    )}, yaklaşık ${tema.kelimeSayisi} kelime`}
                  >
                    <article>
                      <div className="card-cover">
                        <img
                          src={getImageUrl(tema.kapakResmiUrl)}
                          alt={`${tema.baslik} kelime teması kapak görseli`}
                          className="card-image"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/api/placeholder/400/250?text=Görsel+bulunamadı";
                          }}
                        />
                        <div className="card-overlay">
                          <span
                            className={`difficulty-badge ${getDifficultyColor(
                              tema.zorluk
                            )}`}
                          >
                            {getDifficultyText(tema.zorluk)}
                          </span>
                        </div>
                      </div>

                      <div className="card-content">
                        <h4 className="card-title">{tema.baslik}</h4>
                        <p className="card-description">{tema.aciklama}</p>

                        <div className="card-meta">
                          <div className="meta-item">
                            <BookOutlined />
                            <span>{tema.kelimeSayisi} kelime</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-category">
              <ReadOutlined className="empty-icon" />
              <p>Şu anda listelenecek kelime teması bulunmuyor.</p>
            </div>
          )}
        </section>

        {/* Okuma Metinleri */}
        <section
          className="cards-category"
          aria-labelledby="quick-metin-heading"
        >
          <div className="category-header">
            <div className="category-title">
              <FileTextOutlined className="category-icon" />
              <h3 id="quick-metin-heading">Okuma Metinleri</h3>
            </div>
            <Link to="/metinTema" className="view-all-link">
              Tüm okuma metinlerini gör <span aria-hidden="true">→</span>
            </Link>
          </div>

          {metinTemalari.length > 0 ? (
            <ul className="cards-grid">
              {metinTemalari.map((tema) => (
                <li key={tema.id}>
                  <Link
                    to={`/metinler/${tema.id}`}
                    className="quick-link-card"
                    aria-label={`Tema ${tema.temaId} okuma metinleri: ${tema.aciklama}`}
                  >
                    <article>
                      <div className="card-cover">
                        <img
                          src={getImageUrl(tema.kapakResmiUrl)}
                          alt={`Tema ${tema.temaId} okuma metinleri kapak görseli`}
                          className="card-image"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/api/placeholder/400/250?text=Görsel+bulunamadı";
                          }}
                        />
                        <div className="card-overlay">
                          <span className="theme-badge">
                            Tema {tema.temaId}
                          </span>
                        </div>
                      </div>

                      <div className="card-content">
                        <h4 className="card-title">Tema {tema.temaId}</h4>
                        <p className="card-description">{tema.aciklama}</p>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-category">
              <FileTextOutlined className="empty-icon" />
              <p>Şu anda listelenecek okuma metni teması bulunmuyor.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
