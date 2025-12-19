import api from "../ApiService";

/* ========= INTERFACES ========= */

export interface Konu {
  id: number;
  baslik: string;
  zorluk: string;
  calismaSuresi: number;
  aciklama: string;
  temaId: number;
}

export interface Tema {
  id: number;
  baslik: string;
}

/* ========= API CALLS ========= */

export const konuService = {
  getKonular: () => api.get<Konu[]>("/admin/konular"),

  addKonu: (data: Omit<Konu, "id">) =>
    api.post("/admin/konular", data),

  updateKonu: (id: number, data: Omit<Konu, "id">) =>
    api.put(`/admin/konular/${id}`, data),

  deleteKonu: (id: number) =>
    api.delete(`/admin/konular/${id}`),
};

export const temaService = {
  getTemalar: () => api.get<Tema[]>("/admin/tema"),
};
