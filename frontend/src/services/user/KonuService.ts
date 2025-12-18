import api from "../ApiService";

/* ======================
   TYPES
====================== */

export interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama?: string;
}

export interface Kural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  ornekler?: Ornek[];
}

export interface KonuDetail {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
  detayResimUrls?: string[];
  kurallar?: Kural[];
}

export interface KonuListItem {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
}


// 🔹 Tüm konular
export async function getKonular() {
  const res = await api.get("/konular");
  return res.data as KonuListItem[];
}

// 🔹 Konu detayı
export async function getKonuById(id: number | string) {
  const res = await api.get(`/konular/${id}`);
  return res.data as KonuDetail;
}
