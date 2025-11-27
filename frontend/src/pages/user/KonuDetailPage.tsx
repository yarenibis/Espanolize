import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import api from "../../services/ApiService";
import "./KonuDetailPage.css";

interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama: string;
  gramerKuralId: number;
}

interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId: number;
  ornekler: Ornek[];
}

interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "kolay" | "orta" | "zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
  temaId?: number;
  kurallar: GramerKural[];
  detayResimUrls?: string[];
}

export default function KonuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [konu, setKonu] = useState<Konu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchKonuDetay(parseInt(id));
  }, [id]);

  const fetchKonuDetay = async (konuId: number) => {
    try {
      setLoading(true);
      const konuRes = await api.get(`/konular/${konuId}`);
      setKonu(konuRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return "/api/placeholder/600/300?text=Resim+Yok";
    if (url.startsWith("http")) return url;
    return `http://localhost:5001${url}`;
  };

  if (loading)
    return (
      <div className="lesson-container">
        <Navbar />
        <p>Yükleniyor...</p>
      </div>
    );

  if (error || !konu)
    return (
      <div className="lesson-container">
        <Navbar />
        <p>{error || "Konu bulunamadı"}</p>
      </div>
    );

  return (
    <div className="lesson-container">
      <Navbar  />

  

      <h1 className="lesson-title">{konu.baslik}</h1>
      <p className="lesson-description">{konu.aciklama}</p>

      {/* Meta Bilgi */}
      <div className="lesson-meta">
        <span>
          <ClockCircleOutlined /> {konu.calismaSuresi} dakika
        </span>
        <span>
          <UserOutlined /> {konu.zorluk.toUpperCase()}
        </span>
        <span>
          <BookOutlined /> {konu.kurallar.length} kural
        </span>
      </div>

      {/* Kapak Resmi */}
      {konu.kapakResmiUrl && (
        <img
          className="lesson-image"
          src={getImageUrl(konu.kapakResmiUrl)}
          alt="kapak"
        />
      )}

      {/* Kurallar */}
      {konu.kurallar.map((kural, index) => (
        <div key={kural.id} className="rule-block">
          <h2 className="rule-title">
            {index + 1}. {kural.kuralBaslik}
          </h2>

          <p className="rule-text">{kural.aciklama}</p>

          {/* Örnekler */}
          {kural.ornekler.length > 0 && (
            <ul className="rule-list">
              {kural.ornekler.map((o) => (
                <li key={o.id}>
                  <span className="example-es">"{o.ispanyolcaOrnek}"</span>
                  <span className="example-tr"> → {o.ceviri}</span>

                  {o.aciklama && (
                    <div className="example-note">{o.aciklama}</div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Araya detay görsel ekleme */}
          {konu.detayResimUrls && konu.detayResimUrls[index] && (
            <img
              className="lesson-image"
              src={getImageUrl(konu.detayResimUrls[index])}
              alt="detay"
            />
          )}
        </div>
      ))}
    </div>
  );
}
