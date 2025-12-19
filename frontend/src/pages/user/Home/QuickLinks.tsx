import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import {
  type Konu,
  type KelimeTema,
  type MetinTema,
  type Tema,
  quickLinksService,
} from "../../../services/user/QuickLinksService";

import "./QuickLinks.css";

export default function QuickLinks() {
  const [gramerKonulari, setGramerKonulari] = useState<Konu[]>([]);
  const [kelimeTemalari, setKelimeTemalari] = useState<KelimeTema[]>([]);
  const [metinTemalari, setMetinTemalari] = useState<MetinTema[]>([]);
  const [anaTemalar, setAnaTemalar] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickLinks();
  }, []);

  const loadQuickLinks = async () => {
    try {
      setLoading(true);
      const data = await quickLinksService.getAll();

      setGramerKonulari(data.gramerKonulari);
      setKelimeTemalari(data.kelimeTemalari);
      setMetinTemalari(data.metinTemalari);
      setAnaTemalar(data.anaTemalar);
    } catch (error) {
      console.error("❌ QuickLinks yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTemaBaslik = (id: number) =>
    anaTemalar.find(t => t.id === id)?.baslik ?? `Tema ${id}`;

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

        {/* GRAMER */}
        <section className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <BookOutlined className="category-icon" />
              <h3>Gramer Konuları</h3>
            </div>
          </div>

          <ul className="cards-grid">
            {gramerKonulari.map(konu => (
              <li key={konu.id}>
                <Link to={`/konular/${konu.id}`} className="quick-link-card">
                  <article>
                    <div className="card-cover">
                      <img
                        src={getImageUrl(konu.kapakResmiUrl)}
                        alt={konu.baslik}
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
        </section>

        {/* KELİME */}
        <section className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <ReadOutlined className="category-icon" />
              <h3>Kelime Temaları</h3>
            </div>
          </div>

          <ul className="cards-grid">
            {kelimeTemalari.map(tema => (
              <li key={tema.id}>
                <Link to={`/kelimeler/${tema.id}`} className="quick-link-card">
                  <article>
                    <div className="card-cover">
                      <img
                        src={getImageUrl(tema.kapakResmiUrl)}
                        alt={getTemaBaslik(tema.temaId)}
                        className="card-image"
                      />
                    </div>
                    <div className="card-content">
                      <h4 className="card-title">
                        {getTemaBaslik(tema.temaId)}
                      </h4>
                      <p className="card-description">{tema.aciklama}</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* OKUMA */}
        <section className="cards-category">
          <div className="category-header">
            <div className="category-title">
              <FileTextOutlined className="category-icon" />
              <h3>Okuma Metinleri</h3>
            </div>
          </div>

          <ul className="cards-grid">
            {metinTemalari.map(tema => (
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
                      <h4 className="card-title">
                        {getTemaBaslik(tema.temaId)}
                      </h4>
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
