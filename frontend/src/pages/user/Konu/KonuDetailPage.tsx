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

export default function KonuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [konu, setKonu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getDetail(parseInt(id));
  }, [id]);

  const getDetail = async (konuId: number) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/konular/${konuId}`);
      setKonu(data);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (!konu) return;

    document.title = `${konu.baslik} • İspanyolca Gramer`;

    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", konu.aciklama?.slice(0, 150));

    let kw = document.querySelector('meta[name="keywords"]');
    if (!kw) {
      kw = document.createElement("meta");
      kw.setAttribute("name", "keywords");
      document.head.appendChild(kw);
    }
    kw.setAttribute(
      "content",
      `İspanyolca gramer, ${konu.baslik}, açıklama, örnekler`
    );

  }, [konu]);

  const getImageUrl = (url?: string) =>
    !url ? "/api/placeholder/600/300?text=Resim+Yok" :
    url.startsWith("http") ? url : `http://localhost:5001${url}`;

  if (loading)
    return (
      <>
        <Navbar />
        <main className="lesson-container"><p>Yükleniyor...</p></main>
      </>
    );

  if (!konu)
    return (
      <>
        <Navbar />
        <main className="lesson-container"><p>Konu bulunamadı.</p></main>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="lesson-container">
        <header>
          <h1 className="lesson-title">{konu.baslik}</h1>
          <p className="lesson-description">{konu.aciklama}</p>
        </header>

        <section className="lesson-meta">
          <span><ClockCircleOutlined /> {konu.calismaSuresi} dakika</span>
          <span><UserOutlined /> {konu.zorluk.toUpperCase()}</span>
          <span><BookOutlined /> {konu.kurallar.length} kural</span>
        </section>

        {konu.kapakResmiUrl && (
          <img className="lesson-image" src={getImageUrl(konu.kapakResmiUrl)} alt="kapak" />
        )}

        <article>
          {konu.kurallar.map((kural: any, i: number) => (
            <section key={kural.id} className="rule-block">
              <h2 className="rule-title">{i + 1}. {kural.kuralBaslik}</h2>
              <p className="rule-text">{kural.aciklama}</p>

              {kural.ornekler?.length > 0 && (
                <ul className="rule-list">
                  {kural.ornekler.map((o: any) => (
                    <li key={o.id}>
                      <span className="example-es">{o.ispanyolcaOrnek}</span>
                      <span className="example-tr">{o.ceviri}</span>
                      {o.aciklama && <div className="example-note">{o.aciklama}</div>}
                    </li>
                  ))}
                </ul>
              )}

              {konu.detayResimUrls?.[i] && (
                <img className="lesson-image" src={getImageUrl(konu.detayResimUrls[i])} alt="detay" />
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
