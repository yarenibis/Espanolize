import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import "./KonuDetailPage.css";
import { Helmet } from "react-helmet-async";
import { message } from "antd";

import {
  getKonuById,
  type KonuDetail,
} from "../../../services/user/KonuService";

export default function KonuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [konu, setKonu] = useState<KonuDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail(Number(id));
  }, [id]);

  const fetchDetail = async (konuId: number) => {
    try {
      setLoading(true);
      const data = await getKonuById(konuId);
      setKonu(data);
    } catch (err) {
      console.error(err);
      message.error("Konu yüklenirken hata oluştu.");
      setKonu(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) =>
    url
      ? url.startsWith("http")
        ? url
        : `http://localhost:5001${url}`
      : "/api/placeholder/600/300?text=Resim+Yok";

  if (loading)
    return (
      <>
        <Navbar />
        <main className="lesson-container">Yükleniyor…</main>
      </>
    );

  if (!konu)
    return (
      <>
        <Navbar />
        <main className="lesson-container">Konu bulunamadı.</main>
      </>
    );

  return (
    <>
      <Helmet>
        <title>{konu.baslik} | Españolize</title>
      </Helmet>

      <Navbar />

      <main className="lesson-container">
        <h1>{konu.baslik}</h1>
        <p>{konu.aciklama}</p>

        <section className="lesson-meta">
          <span>
            <ClockCircleOutlined /> {konu.calismaSuresi} dk
          </span>
          <span>
            <UserOutlined /> {konu.zorluk}
          </span>
          <span>
            <BookOutlined /> {konu.kurallar?.length ?? 0} kural
          </span>
        </section>

        {konu.kapakResmiUrl && (
          <img
            src={getImageUrl(konu.kapakResmiUrl)}
            className="lesson-image"
            alt={konu.baslik}
          />
        )}

        {konu.kurallar?.map((kural, i) => (
          <section key={kural.id} className="rule-block">
            <h2>{i + 1}. {kural.kuralBaslik}</h2>
            {konu.detayResimUrls?.[i] && (
      <img
        src={getImageUrl(konu.detayResimUrls[i])}
        alt={kural.kuralBaslik}
        className="rule-image"
      />
    )}
            <p>{kural.aciklama}</p>
    

            {kural.ornekler?.map((o) => (
              <div key={o.id} className="example">
                <strong>{o.ispanyolcaOrnek}</strong> – {o.ceviri}
                {o.aciklama && <div>{o.aciklama}</div>}
              </div>
            ))}
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
