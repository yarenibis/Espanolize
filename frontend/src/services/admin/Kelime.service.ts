import api from "../ApiService";

/* =======================
   INTERFACELER (API DTO)
======================= */

export interface KelimeDto {
  id: number;
  ispanyolca: string;
  turkce: string;
  kelimeTemasiId: number;
}

export interface CreateKelimeDto {
  ispanyolca: string;
  turkce: string;
  kelimeTemasiId: number;
}

/* =======================
   SERVICE FONKSİYONLARI
======================= */

export const kelimeService = {
  getAll: () =>
    api.get<KelimeDto[]>("/admin/kelimeler"),

  create: (data: CreateKelimeDto) =>
    api.post("/admin/kelimeler", data),

  update: (id: number, data: CreateKelimeDto) =>
    api.put(`/admin/kelimeler/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/kelimeler/${id}`)
};
