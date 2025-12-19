import api from "../ApiService";

// ------------------ TYPES ------------------
export interface Konu {
  id: number;
  baslik: string;
  aciklama: string;
  zorluk: "Kolay" | "Orta" | "Zor";
  calismaSuresi: number;
  kapakResmiUrl?: string;
}

export interface KelimeTema {
  id: number;
  temaId: number;
  aciklama: string;
  kelimeSayisi: number;
  kapakResmiUrl?: string;
}

export interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
}

export interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

// ------------------ NORMALIZERS ------------------
const normalizeKonular = (data: any[]): Konu[] =>
  Array.isArray(data)
    ? data.map(item => ({
        id: item.id ?? item.Id,
        baslik: item.baslik ?? item.Baslik,
        aciklama: item.aciklama ?? item.Aciklama,
        zorluk: item.zorluk ?? "Kolay",
        calismaSuresi: item.calismaSuresi ?? 0,
        kapakResmiUrl: item.kapakResmiUrl,
      }))
    : [];

const normalizeKelimeTemalari = (data: any[]): KelimeTema[] =>
  Array.isArray(data)
    ? data.map(item => ({
        id: item.id ?? item.Id,
        temaId: item.temaId ?? item.TemaId,
        aciklama: item.aciklama ?? item.Aciklama,
        kelimeSayisi: item.kelimeSayisi ?? 0,
        kapakResmiUrl: item.kapakResmiUrl,
      }))
    : [];

const normalizeMetinTemalari = (data: any[]): MetinTema[] =>
  Array.isArray(data)
    ? data.map(item => ({
        id: item.id ?? item.Id,
        temaId: item.temaId ?? item.TemaId,
        aciklama: item.aciklama ?? item.Aciklama,
        kapakResmiUrl: item.kapakResmiUrl,
      }))
    : [];

// ------------------ SERVICE ------------------
export const quickLinksService = {
  async getAll() {
    const [gramerRes, kelimeRes, metinRes, temaRes] = await Promise.all([
      api.get("/konular?limit=3"),
      api.get("/kelimetemalari?limit=3"),
      api.get("/metinTema?limit=3"),
      api.get("/tema"),
    ]);

    return {
      gramerKonulari: normalizeKonular(gramerRes.data),
      kelimeTemalari: normalizeKelimeTemalari(kelimeRes.data),
      metinTemalari: normalizeMetinTemalari(metinRes.data),
      anaTemalar: temaRes.data ?? [],
    };
  },
};
