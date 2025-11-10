import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import api from "../../services/ApiService";
import Navbar from "../../components/adminDashboard/Navbar";

export default function GramerKuralImagesPage() {
  const { id } = useParams();
  const [kural, setKural] = useState<any>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [detailFiles, setDetailFiles] = useState<FileList | null>(null);
console.log("ID:", id);
  useEffect(() => {
    api.get(`/admin/gramerkurallar/${id}`).then((res) => setKural(res.data));
  }, [id]);

  const uploadCover = async () => {
  console.log("▶ ▶ uploadCover ÇALIŞTI", coverFile);

  if (!coverFile) {
    alert("Resim seçilmedi!");
    return;
  }

  const formData = new FormData();
  formData.append("file", coverFile);

  await api.post(`/admin/gramerkurallar/${id}/upload-cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  const updated = await api.get(`/admin/gramerkurallar/${id}`);
  setKural(updated.data);
};



  const uploadDetails = async () => {
    if (!detailFiles || detailFiles.length === 0) return alert("Resim seç!");

    const formData = new FormData();
    for (let i = 0; i < detailFiles.length; i++) {
      formData.append("files", detailFiles[i]);
    }

    await api.post(`/admin/gramerkurallar/${id}/upload-details`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // Reload
    const updated = await api.get(`/admin/gramerkurallar/${id}`);
    setKural(updated.data);
  };

  if (!kural) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6">
      <Navbar />

      <h1 className="text-2xl font-bold mb-4">{kural.kuralBaslik} - Resim Yönetimi</h1>

      {/* Kapak resmi */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Kapak Resmi</h2>
        {kural.kapakResmiUrl ? (
          <img src={kural.kapakResmiUrl} alt="Kapak" className="w-64 rounded shadow mb-3" />
        ) : (
          <p className="text-gray-500 mb-2">Kapak resmi yok.</p>
        )}

        <input type="file" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
        <button
         type="button"
          onClick={uploadCover}
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          Yükle
        </button>
      </div>

      {/* Detay resimleri */}
      <h2 className="text-xl font-semibold mb-2">Detay Resimleri</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {kural.detayResimUrls?.map((url: string, index: number) => (
          <img key={index} src={url} className="rounded shadow" />
        ))}
      </div>

      <input type="file" multiple onChange={(e) => setDetailFiles(e.target.files)} />
      <button
        type="button"
        onClick={uploadDetails}
        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        Yükle
      </button>
    </div>
  );
}
