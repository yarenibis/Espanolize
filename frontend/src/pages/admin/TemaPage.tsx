import { useEffect, useState } from "react";
import api from "../../services/ApiService";

interface Tema {
  id: number;
  baslik: string;
  kapakResmiUrl?: string | null;
  detayResimler?: { id: number; resimUrl: string; dosyaAdi: string }[];
}

export default function TemaPage() {
  const [temalar, setTemalar] = useState<Tema[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await api.get("/admin/tema");
      console.log("Tema listesi:", list.data);
      
      const fullData = await Promise.all(
        list.data.map(async (t: any) => {
          const det = await api.get(`/admin/tema/${t.id}`);
          console.log(`Tema ${t.id} detay:`, det.data);
          return det.data;
        })
      );
      setTemalar(fullData);
    } catch (error) {
      console.error("Temalar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function createTema() {
    if (!yeniBaslik.trim()) return alert("Başlık gerekli!");
    try {
      await api.post("/admin/tema", { baslik: yeniBaslik });
      setYeniBaslik("");
      load();
    } catch (error) {
      alert("Tema oluşturulurken hata oluştu!");
    }
  }

  async function uploadCover(id: number, file: File) {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post(`/admin/tema/${id}/upload-cover`, form);
      load();
    } catch (error) {
      alert("Kapak resmi yüklenirken hata oluştu!");
    }
  }

  async function uploadDetails(id: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      await api.post(`/admin/tema/${id}/upload-details`, form);
      load();
    } catch (error) {
      alert("Detay resimleri yüklenirken hata oluştu!");
    }
  }

  async function deleteDetail(id: number, url: string) {
    if (!confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;
    try {
      await api.delete(`/admin/tema/${id}/details`, { params: { url } });
      load();
    } catch (error) {
      alert("Görsel silinirken hata oluştu!");
    }
  }

  async function deleteTema(id: number) {
    if (!confirm("Tema ve tüm resimleri silinecek, emin misiniz?")) return;
    try {
      await api.delete(`/admin/tema/${id}`);
      load();
    } catch (error) {
      alert("Tema silinirken hata oluştu!");
    }
  }

  // Dosya adını URL'den çıkaran fonksiyon
  function getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || 'dosya.jpg';
    } catch {
      return url.split('/').pop() || 'dosya.jpg';
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
 
      
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 Tema Yönetimi</h1>
        <p className="text-gray-600">Temaları oluşturun ve görsellerini yönetin</p>
      </div>

      {/* Yeni Tema Ekle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Yeni Tema Ekle</h2>
        <div className="flex gap-3">
          <input
            value={yeniBaslik}
            onChange={(e) => setYeniBaslik(e.target.value)}
            placeholder="Tema başlığı giriniz..."
            className="border border-gray-300 p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            onKeyPress={(e) => e.key === 'Enter' && createTema()}
          />
          <button
            onClick={createTema}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>➕</span>
            Tema Ekle
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800">Debug Bilgisi:</h3>
        <p className="text-yellow-700 text-sm">
          Toplam {temalar.length} tema yüklendi. 
          Detay resimleri olan temalar: {temalar.filter(t => t.detayResimler && t.detayResimler.length > 0).length}
        </p>
      </div>

      {/* Tema Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {temalar.map((tema) => (
          <div
            key={tema.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
          >
            {/* Kapak Görseli - Daha küçük */}
            <div className="relative bg-gray-100">
              <img
                src={tema.kapakResmiUrl || "/api/placeholder/200/120?text=Kapak+Resmi+Yok"}
                alt={tema.baslik}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/200/120?text=Resim+Yok";
                }}
              />
              <label className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-opacity-90 transition flex items-center gap-1">
                <span>📤</span>
                Kapak Yükle
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadCover(tema.id, e.target.files![0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* İçerik */}
            <div className="p-4">
              {/* Tema Başlığı */}
              <h2 className="text-lg font-bold text-gray-800 mb-3 truncate border-b pb-2">
                {tema.baslik}
              </h2>

              {/* API'den gelen veriyi kontrol et */}
              <div className="text-xs text-gray-500 mb-2">
                Tema ID: {tema.id} | 
                Detay Resimleri: {tema.detayResimler ? tema.detayResimler.length : 0}
              </div>

              {/* Detay Görselleri */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span>🖼️</span>
                    Detay Görselleri:
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tema.detayResimler ? tema.detayResimler.length : 0} adet
                  </span>
                </div>

                {/* Görsel Listesi */}
                <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                  {!tema.detayResimler || tema.detayResimler.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-2 bg-gray-50 rounded">
                      Henüz görsel yüklenmemiş
                    </div>
                  ) : (
                    tema.detayResimler.map((img) => (
                      <div 
                        key={img.id} 
                        className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm group hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-blue-500">📷</span>
                          <span className="truncate" title={img.dosyaAdi || getFileNameFromUrl(img.resimUrl)}>
                            {img.dosyaAdi || getFileNameFromUrl(img.resimUrl)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <a 
                            href={img.resimUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-700 text-xs"
                            title="Görseli Görüntüle"
                          >
                            👁️
                          </a>
                          <button
                            onClick={() => deleteDetail(tema.id, img.resimUrl)}
                            className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition px-1"
                            title="Görseli Sil"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Galeri Yükle Butonu */}
                <label className="w-full bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded cursor-pointer hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-200">
                  <span>📎</span>
                  Galeri Yükle
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => uploadDetails(tema.id, e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sil Butonu */}
              <button
                onClick={() => deleteTema(tema.id)}
                className="w-full bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded font-medium transition flex items-center justify-center gap-2 border border-red-200 mt-2 text-sm"
              >
                <span>🗑️</span>
                Temayı Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Temalar yoksa */}
      {temalar.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz tema bulunmuyor</h3>
          <p className="text-gray-500">Yukarıdaki formu kullanarak ilk temanızı oluşturun.</p>
        </div>
      )}
    </div>
  );
}