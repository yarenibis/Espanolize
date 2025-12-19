import api from "../ApiService";

/* =====================
   INTERFACELER
===================== */

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

export const metinTemaService = {
  getAll: () =>
    api.get<MetinTema[]>("/admin/metin-temalari"),

  add: (data: Omit<MetinTema, "id">) =>
    api.post("/admin/metin-temalari", data),

  update: (id: number, data: Omit<MetinTema, "id">) =>
    api.put(`/admin/metin-temalari/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/metin-temalari/${id}`),
};

export const temaService = {
  getAll: () =>
    api.get<Tema[]>("/admin/tema"),
};
