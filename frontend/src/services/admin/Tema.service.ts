import api from "../ApiService";

/* =====================
   INTERFACELER
===================== */

export interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string;
  detayResimUrls?: string[];
}

/* =====================
   SERVICE
===================== */

export const temaService = {
  getAll: () =>
    api.get<Tema[]>("/admin/tema"),

  add: (data: { baslik: string }) =>
    api.post("/admin/tema", data),

  delete: (id: number) =>
    api.delete(`/admin/tema/${id}`),

  uploadCover: (temaId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/admin/tema/${temaId}/upload-cover`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadDetails: (temaId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    return api.post(`/admin/tema/${temaId}/upload-details`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteCover: (temaId: number) =>
    api.delete(`/admin/tema/${temaId}/cover`),

  deleteDetail: (temaId: number, url: string) =>
    api.delete(
      `/admin/tema/${temaId}/details?url=${encodeURIComponent(url)}`
    ),
};
