using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;


namespace api.src.Helpers
{
    public class ImageUploadHelper
    {
        private readonly IWebHostEnvironment _env;

        public ImageUploadHelper(IWebHostEnvironment env)
        {
            _env = env;
        }

        // -------------------------------
        // 📁 ROOT PATH (wwwroot/uploads/{category}/{ownerId})
        // -------------------------------
        private string GetRoot(int category, int ownerId)
        {
            string basePath = Path.Combine(
                _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                "uploads",
                category.ToString(),
                ownerId.ToString()
            );

            Directory.CreateDirectory(basePath);
            return basePath;
        }

        // -------------------------------
        // 🌍 Public URL üret
        // -------------------------------
        private string BuildPublicUrl(string relativePath)
        {
            relativePath = relativePath.Replace("\\", "/");

            // localhost:5001 + /uploads/...
            return $"{relativePath}";
        }

        // -------------------------------
        // 📌 Fiziksel dosya yolunu URL'den çöz
        // -------------------------------
        public string UrlToPhysicalPath(string url)
        {
            // url: /uploads/Gramer/3/gallery/img_xxx.jpg

            string webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (url.StartsWith("/"))
                url = url.Substring(1);

            return Path.Combine(webRoot, url.Replace("/", Path.DirectorySeparatorChar.ToString()));
        }

        // -------------------------------
        // 🖼️ KAPAK RESMİ YÜKLEME
        // -------------------------------
        public async Task<string> UploadCover(int category, int ownerId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("Dosya boş!");

            string root = GetRoot(category, ownerId);

            // eski kapakları sil
            var oldCover = Directory.GetFiles(root, "cover_*");
            foreach (var old in oldCover)
                File.Delete(old);

            string ext = Path.GetExtension(file.FileName);
            string fileName = $"cover_{Guid.NewGuid():N}{ext}";
            string phys = Path.Combine(root, fileName);

            using (var fs = new FileStream(phys, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            string relative = $"/uploads/{category}/{ownerId}/{fileName}";
            return BuildPublicUrl(relative);
        }

        // -------------------------------
        // 🗂️ Çoklu GALERİ yükleme
        // -------------------------------
        public async Task<List<string>> UploadGallery(int category, int ownerId, List<IFormFile> files)
        {
            List<string> urls = new();

            if (files == null || files.Count == 0)
                return urls;

            string galleryPath = Path.Combine(GetRoot(category, ownerId), "gallery");
            Directory.CreateDirectory(galleryPath);

            foreach (var file in files)
            {
                if (file.Length == 0)
                    continue;

                string ext = Path.GetExtension(file.FileName);
                string fileName = $"img_{Guid.NewGuid():N}{ext}";
                string phys = Path.Combine(galleryPath, fileName);

                using (var fs = new FileStream(phys, FileMode.Create))
                {
                    await file.CopyToAsync(fs);
                }

                string relative = $"/uploads/{category}/{ownerId}/gallery/{fileName}";
                urls.Add(BuildPublicUrl(relative));
            }

            return urls;
        }

        // -------------------------------
        // 🗑️ Tek görsel sil
        // -------------------------------
        public void DeletePhysical(string url)
        {
            string phys = UrlToPhysicalPath(url);

            if (File.Exists(phys))
                File.Delete(phys);
        }

        // -------------------------------
        // 🚮 Bir kategorinin owner klasörünü komple sil
        // ör: /uploads/Gramer/3
        // -------------------------------
        public void DeleteCategoryFolder(int category, int ownerId)
        {
            string root = GetRoot(category, ownerId);

            if (Directory.Exists(root))
                Directory.Delete(root, recursive: true);
        }
    }
}
