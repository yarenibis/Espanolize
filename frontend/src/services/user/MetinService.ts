// src/services/MetinService.ts
import api from "../ApiService";

/* =====================
   Interface'ler
===================== */

export interface Metin {
  id: number;
  baslik: string;
  icerik: string;
  ceviri: string;
  aciklama: string;
  zorluk: string;
  okumaSuresi: number;
  kapakResmiUrl?: string;
  metinTemaId: number;
}

export interface MetinTema {
  id: number;
  temaId: number;
  aciklama: string;
  kapakResmiUrl?: string;
  zorluk: "Kolay" | "Orta" | "Zor" | "Bilinmiyor";
}

export interface MetinTemaDetay {
  id: number;
  aciklama: string;
  temaId: number;
  metinler: Metin[];
}

export interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
}

/* =====================
   Service Fonksiyonları
===================== */

const MetinService = {
  /* -------------------------------------------------
     Metin tema listesi (detay + zorluk dahil)
  ------------------------------------------------- */
  getMetinTemalari: async (): Promise<MetinTema[]> => {
    const res = await api.get("/metinTema");
    const baseItems = res.data ?? [];

    const detailed = await Promise.all(
      baseItems.map(async (item: any) => {
        try {
          const detailRes = await api.get(`/metinTema/${item.id}`);
          const detail = detailRes.data;

          return {
            id: item.id,
            temaId: item.temaId ?? detail.temaId,
            aciklama: item.aciklama ?? detail.aciklama,
            kapakResmiUrl:
              item.kapakResmiUrl ?? detail.kapakResmiUrl,
            zorluk:
              detail?.zorluk ??
              detail?.metinler?.[0]?.zorluk ??
              "Bilinmiyor",
          } as MetinTema;
        } catch (err) {
          console.error("Metin tema detay yüklenemedi:", err);
          return null;
        }
      })
    );

    return detailed.filter(Boolean) as MetinTema[];
  },

  /* -------------------------------------------------
     Tek metin tema detayı
  ------------------------------------------------- */
  getMetinTemaDetay: async (
    id: string | number
  ): Promise<MetinTemaDetay> => {
    const res = await api.get(`/metinTema/${id}`);
    const d = res.data;

    return {
      id: d.id,
      aciklama: d.aciklama,
      temaId: d.temaId,
      metinler: Array.isArray(d.metinler) ? d.metinler : [],
    };
  },

  /* -------------------------------------------------
     Tema başlıkları
  ------------------------------------------------- */
  getTemaById: async (id: number): Promise<Tema> => {
    const res = await api.get(`/tema/${id}`);
    return {
      id: res.data?.id ?? id,
      baslik: res.data?.baslik ?? `Tema ${id}`,
      kapakResmiUrl: res.data?.kapakResmiUrl,
    };
  },

  getTemalarByIds: async (ids: number[]): Promise<Tema[]> => {
    const uniqueIds = [...new Set(ids)];

    const results = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          return await MetinService.getTemaById(id);
        } catch {
          return {
            id,
            baslik: `Tema ${id}`,
            kapakResmiUrl: undefined,
          };
        }
      })
    );

    return results;
  },
};

export default MetinService;
