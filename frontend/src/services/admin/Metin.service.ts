import api from "../ApiService";

/* =====================
   INTERFACELER
===================== */

export interface Metin {
  id: number;
  icerik: string;
  ceviri: string;
  zorluk: string;
  metinTemaId: number;
}

export interface MetinTema {
  id: number;
  aciklama: string;
  temaId: number;
}

export interface Tema {
  id: number;
  baslik: string;
}

/* =====================
   SERVICE
===================== */

export const metinService = {
  getAll: () =>
    api.get<Metin[]>("/admin/metinler"),

  add: (data: Omit<Metin, "id">) =>
    api.post("/admin/metinler", data),

  update: (id: number, data: Omit<Metin, "id">) =>
    api.put(`/admin/metinler/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/metinler/${id}`),
};

export const metinTemaLookupService = {
  getAll: () =>
    api.get<MetinTema[]>("/admin/metin-temalari"),
};

export const temaLookupService = {
  getAll: () =>
    api.get<Tema[]>("/admin/tema"),
};
