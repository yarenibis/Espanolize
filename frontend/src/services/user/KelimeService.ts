// src/services/KelimeService.ts
import api from "../ApiService";

/* =====================
   Interface'ler
===================== */

export interface Kelime {
  id: number;
  ispanyolca: string;
  turkce: string;
}

export interface KelimeTema {
  id: number;
  aciklama: string;
  temaId: number;
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

export interface KelimeTemaDetay {
  id: number;
  aciklama: string;
  temaId: number;
  kapakResmiUrl?: string;
  detayResimUrls?: string[];
  kelimeler: Kelime[];
}

export interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

/* =====================
   Service Fonksiyonları
===================== */

const KelimeService = {
  // 🔹 Tüm kelime temaları
  getKelimeTemalari: async () => {
    const res = await api.get<KelimeTema[]>("/kelimetemalari");
    return res.data;
  },

  // 🔹 Tek bir kelime temasının detayı
  getKelimeTemaDetay: async (id: string | number) => {
    const res = await api.get(`/kelimetemalari/${id}`);
    const t = res.data;

    // API field uyumsuzluklarını burada çözüyoruz
    const mapped: KelimeTemaDetay = {
      id: t.id ?? t.Id,
      aciklama: t.aciklama ?? t.Aciklama,
      temaId: t.temaId ?? t.TemaId,
      kapakResmiUrl: t.kapakResmiUrl ?? t.KapakResmiUrl,
      detayResimUrls: t.detayResimUrls ?? t.DetayResimUrls ?? [],
      kelimeler: (t.kelimeler ?? t.Kelimeler)?.map((k: any) => ({
        id: k.id ?? k.Id,
        ispanyolca: k.ispanyolca ?? k.Ispanyolca,
        turkce: k.turkce ?? k.Turkce,
      })),
    };

    return mapped;
  },

  // 🔹 Tüm ana temalar
  getTemalar: async () => {
    const res = await api.get<Tema[]>("/tema");
    return res.data;
  },

  // 🔹 Tek ana tema
  getTemaById: async (id: number) => {
    const res = await api.get<Tema>(`/tema/${id}`);
    return res.data;
  },
};

export default KelimeService;
