import api from "../ApiService";

/* =======================
   INTERFACELER (API DTO)
======================= */

export interface KelimeTemaDto {
  id: number;
  aciklama: string;
  temaId: number;
}

export interface TemaDto {
  id: number;
  baslik: string;
}

export interface CreateKelimeTemaDto {
  aciklama: string;
  temaId: number;
}

/* =======================
   SERVICE FONKSİYONLARI
======================= */

export const kelimeTemaService = {
  getAllKelimeTemalari: () =>
    api.get<KelimeTemaDto[]>("/admin/kelime-temalari"),

  getAllTemalar: () =>
    api.get<TemaDto[]>("/admin/tema"),

  createKelimeTema: (data: CreateKelimeTemaDto) =>
    api.post("/admin/kelime-temalari", data),

  updateKelimeTema: (id: number, data: CreateKelimeTemaDto) =>
    api.put(`/admin/kelime-temalari/${id}`, data),

  deleteKelimeTema: (id: number) =>
    api.delete(`/admin/kelime-temalari/${id}`)
};
