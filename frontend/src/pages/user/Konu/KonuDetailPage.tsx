import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import api from "../../../services/ApiService";
import "./KonuDetailPage.css";
import { message } from "antd";
import { Helmet } from "react-helmet-async";

export default function KonuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [konu, setKonu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =======================
  // 📌 DETAY GETİRME
  // =======================
  useEffect(() => {
    if (id) getDetail(parseInt(id));
  }, [id]);

  const getDetail = async (konuId: number) => {
    try {
      setLoading(true);

      const { data } = await api.get(`/konular/${konuId}`);
      setKonu(data);

    } catch (err) {
      console.error("Konu yüklenemedi:", err);
      message.error("Konu yüklenirken bir hata oluştu.");
      setKonu(null);
    } finally {
      setLoading(false);
    }
  };

  

  // =======================
  // 📌 RESİM URL OLUŞTURMA
  // =======================
  const getImageUrl = (url?: string) => {
    try {
      return !url
        ? "/api/placeholder/600/300?text=Resim+Yok"
        : url.startsWith("http")
        ? url
        : `http://localhost:5001${url}`;
    } catch {
      return "/api/placeholder/600/300?text=Hata";
    }
  };

  // =======================
  // 📌 LOADING DURUMU
  // =======================
  if (loading)
    return (
      <>
        <Navbar />
        <main className="lesson-container">
          <p>Yükleniyor...</p>
        </main>
      </>
    );

  // =======================
  // 📌 KONU BULUNAMADI
  // =======================
  if (!konu)
    return (
      <>
        <Navbar />
        <main className="lesson-container">
          <p>Konu bulunamadı.</p>
        </main>
      </>
    );

  // =======================
  // 📌 ASIL SAYFA
  // =======================
  return (
    <>
    <Helmet>
    <title>
      {konu.baslik} : İspanyolca'da {konu.baslik} kullanımı  | Españolize
    </title>

    <meta
      name="description"
      content={
        konu.aciklama
          ? `${konu.aciklama.slice(0, 155)}`
          : "İspanyolca gramer konusunu örneklerle öğrenin. Kurallar, açıklamalar ve pratik kullanım."
      }
    />

    {/* Open Graph */}
    <meta
      property="og:title"
      content={`${konu.baslik} | İspanyolca Gramer`}
    />
    <meta
      property="og:description"
      content={konu.aciklama ?? ""}
    />
    <meta
      property="og:type"
      content="article"
    />
    <meta
      property="og:url"
      content={`http://localhost:5173/konular/${id}`}
    />

    {konu.kapakResmiUrl && (
      <meta
        property="og:image"
        content={getImageUrl(konu.kapakResmiUrl)}
      />
    )}
  </Helmet>
      <Navbar />

      <main className="lesson-container">
        <header>
          <h1 className="lesson-title">{konu.baslik}</h1>
          <p className="lesson-description">{konu.aciklama}</p>
        </header>

        <section className="lesson-meta">
          <span><ClockCircleOutlined /> {konu.calismaSuresi} dakika</span>
          <span><UserOutlined /> {konu.zorluk?.toUpperCase?.()}</span>
          <span><BookOutlined /> {konu.kurallar?.length ?? 0} kural</span>
        </section>

        {konu.kapakResmiUrl && (
          <img
            className="lesson-image"
            src={getImageUrl(konu.kapakResmiUrl)}
            alt="kapak"
          />
        )}

        <article>
          {konu.kurallar?.map((kural: any, i: number) => (
            <section key={kural.id} className="rule-block">
              <h2 className="rule-title">{i + 1}. {kural.kuralBaslik}</h2>
              <p className="rule-text">{kural.aciklama}</p>

              {kural.ornekler?.length > 0 && (
                <ul className="rule-list">
                  {kural.ornekler.map((o: any) => (
                    <li key={o.id}>
                      <span className="example-es">{o.ispanyolcaOrnek}</span>
                      <span className="example-tr">{o.ceviri}</span>
                      {o.aciklama && (
                        <div className="example-note">{o.aciklama}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {konu.detayResimUrls?.[i] && (
                <img
                  className="lesson-image"
                  src={getImageUrl(konu.detayResimUrls[i])}
                  alt="detay"
                />
              )}
            </section>
          ))}
        </article>
      </main>

      <Footer />
    </>
  );
}
