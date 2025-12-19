import api from "../ApiService";


export interface Konu {
  id: number;
  baslik: string;
}

export interface GramerKural {
  id: number;
  kuralBaslik: string;
  aciklama: string;
  konuId: number;
}


export const gramerKuralService = {
  getAll: () => api.get<GramerKural[]>("/admin/gramerkurallar"),

  add: (data: Omit<GramerKural, "id">) =>
    api.post("/admin/gramerkurallar", data),

  update: (id: number, data: Omit<GramerKural, "id">) =>
    api.put(`/admin/gramerkurallar/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/gramerkurallar/${id}`),
};

export const konuService = {
  getAll: () => api.get<Konu[]>("/admin/konular"),
};
