import api from "../ApiService";


export interface Ornek {
  id: number;
  ispanyolcaOrnek: string;
  ceviri: string;
  aciklama?: string;
  gramerKuralId: number;
}

export interface GramerKural {
  id: number;
  kuralBaslik: string;
}

/* =====================
   SERVICE
===================== */

export const ornekService = {
  getAll: () =>
    api.get<Ornek[]>("/admin/ornekler"),

  add: (data: Omit<Ornek, "id">) =>
    api.post("/admin/ornekler", data),

  update: (id: number, data: Omit<Ornek, "id">) =>
    api.put(`/admin/ornekler/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/ornekler/${id}`),
};

export const gramerKuralService = {
  getAll: () =>
    api.get<GramerKural[]>("/admin/gramerkurallar"),
};
