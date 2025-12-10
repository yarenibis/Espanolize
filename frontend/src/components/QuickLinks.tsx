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
  temaId: number;
  aciklama: string;
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

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

export default function QuickLinks() {
  const [gramerKonulari, setGramerKonulari] = useState<Konu[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [anaTemalar, setAnaTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = async () => {
    try {
      setLoading(true);

      const [gramerRes, kelimeRes, metinRes, anaTemaRes] = await Promise.all([
        api.get("/konular?limit=3"),
        api.get("/kelimetemalari?limit=3"),
        api.get("/metinTema?limit=3"),
        api.get("/tema"), // ⭐ Başlıklar burada
      ]);

      setAnaTemalar(anaTemaRes.data);
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

  const normalizeKonular = (data: any[]): Konu[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      baslik: item.baslik ?? item.Baslik,
      aciklama: item.aciklama ?? item.Aciklama,
      zorluk: item.zorluk ?? "Kolay",
      calismaSuresi: item.calismaSuresi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl,
    }));

  const normalizeKelimeTemalari = (data: any[]): KelimeTema[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      temaId: item.temaId ?? item.TemaId,
      aciklama: item.aciklama ?? item.Aciklama,
      kelimeSayisi: item.kelimeSayisi ?? 0,
      kapakResmiUrl: item.kapakResmiUrl,
    }));

  const normalizeMetinTemalari = (data: any[]): MetinTema[] =>
    data.map((item: any) => ({
      id: item.id ?? item.Id,
      temaId: item.temaId ?? item.TemaId,
      aciklama: item.aciklama ?? item.Aciklama,
      kapakResmiUrl: item.kapakResmiUrl,
    }));

  // ⭐ Tema başlığı bul
  const getTemaBaslik = (id: number): string => {
    const tema = anaTemalar.find(t => t.id === id);
    return tema?.baslik ?? `Tema ${id}`;
  };

  const getImageUrl = (url?: string) =>
    !url
      ? "/api/placeholder/400/250?text=Görsel+Yok"
      : url.startsWith("http")
      ? url
      : `http://localhost:5001${url}`;

  if (loading) {
    return (
      <section className="quick-links-section">
        <div className="container">
          <div className="quick-loading-state">
            <div className="quick-loading-spinner" />
            <p>İçerikler yükleniyor…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="quick-links-section">
      <div className="container">
        <section className="cards-category" aria-labelledby="quick-gramer-heading">
  <div className="category-header">
    <div className="category-title">
      <BookOutlined className="category-icon" />
      <h3 id="quick-gramer-heading">Gramer Konuları</h3>
    </div>
  </div>

  {gramerKonulari.length > 0 ? (
    <ul className="cards-grid">
      {gramerKonulari.map((konu) => (
        <li key={konu.id}>
          <Link to={`/konular/${konu.id}`} className="quick-link-card">
            <article>
              <div className="card-cover">
                <img
                  src={getImageUrl(konu.kapakResmiUrl)}
                  alt={`${konu.baslik} konusu`}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <h4 className="card-title">{konu.baslik}</h4>
                <p className="card-description">{konu.aciklama}</p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <div className="empty-category">
      <BookOutlined className="empty-icon" />
      <p>Şu anda listelenecek gramer konusu yok.</p>
    </div>
  )}
</section>

        {/* ------------------ Kelime Temaları ------------------ */}
        <section className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <ReadOutlined className="category-icon" />
              <h3>Kelime Temaları</h3>
            </div>
          </div>

          <ul className="cards-grid">
            {kelimeTemalari.map((tema) => (
              <li key={tema.id}>
                <Link to={`/kelimetemalari/${tema.id}`} className="quick-link-card">
                  <article>
                    <div className="card-cover">
                      <img
                        src={getImageUrl(tema.kapakResmiUrl)}
                        alt={getTemaBaslik(tema.temaId)}
                        className="card-image"
                      />
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">{getTemaBaslik(tema.temaId)}</h4>
                      <p className="card-description">{tema.aciklama}</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------ Okuma Metinleri ------------------ */}
        <section className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <FileTextOutlined className="category-icon" />
              <h3>Okuma Metinleri</h3>
            </div>
          </div>

          <ul className="cards-grid">
            {metinTemalari.map((tema) => (
              <li key={tema.id}>
                <Link to={`/metinler/${tema.id}`} className="quick-link-card">
                  <article>
                    <div className="card-cover">
                      <img
                        src={getImageUrl(tema.kapakResmiUrl)}
                        alt={getTemaBaslik(tema.temaId)}
                        className="card-image"
                      />
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">{getTemaBaslik(tema.temaId)}</h4>
                      <p className="card-description">{tema.aciklama}</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
