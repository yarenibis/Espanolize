using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.src.Data;
using api.src.Interface;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;
using Microsoft.EntityFrameworkCore;
using api.src.Helpers;

namespace api.src.Controllers
{
    [Route("api/admin/gramerkurallar")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class GramerKuralController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGramer _repository;
        private readonly ImageUploadHelper _imageHelper;
        private const int CategoryId = 3;

        public GramerKuralController(
            ApplicationDbContext context,
            IGramer repository,
            ImageUploadHelper imageHelper)
        {
            _context = context;
            _repository = repository;
            _imageHelper = imageHelper;
        }

        // ----------------------------------------------------
        // 📌 TÜM KURALLAR (List DTO)
        // ----------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _repository.GetAllAsync();
            return Ok(list.Select(x => x.ToGramerKuralListDto()));
        }

        // ----------------------------------------------------
        // 📌 TEK KURAL GETİR (Detay DTO)
        // ----------------------------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var kural = await _repository.GetByIdAsync(id);
            if (kural == null)
                return NotFound();

            return Ok(kural.ToGramerKuralDetayDto());
        }

        // ----------------------------------------------------
        // 📌 YENİ KURAL EKLE
        // ----------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> CreateKural([FromBody] GramerKuralRequest request)
        {
            var model = request.CreateGramerKuralDto();
            await _repository.CreateAsync(model);

            return CreatedAtAction(nameof(GetById),
                new { id = model.Id },
                model.ToGramerKuralListDto());
        }

        // ----------------------------------------------------
        // 📌 KURAL GÜNCELLE
        // ----------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKural(int id, [FromBody] GramerKuralRequest request)
        {
            var model = await _repository.GetByIdAsync(id);
            if (model == null)
                return NotFound();

            var updated = await _repository.UpdateAsync(id, request);
            return Ok(updated.ToGramerKuralListDto());
        }

        // ----------------------------------------------------
        // 📌 KURAL SİL (RESİMLERLE BİRLİKTE)
        // ----------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKelimeTema([FromRoute] int id)
        {
            var tema = await _context.GramerKurallar
                .Include(t => t.DetayResimler)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            // 📁 Upload klasörünü sil
            _imageHelper.DeleteCategoryFolder(CategoryId, id);

            // 📦 DB’den resimleri sil
            if (tema.DetayResimler.Any())
                _context.TemaResimleri.RemoveRange(tema.DetayResimler);

            // 📦 Tema’yı sil
            await _repository.DeleteAsync(id);

            return NoContent();
        }

        // ----------------------------------------------------
        // 📌 KAPAK RESMİ YÜKLE
        // ----------------------------------------------------
        [HttpPost("{id}/upload-cover")]
        public async Task<IActionResult> UploadCover(int id, IFormFile file)
        {
            var tema = await _context.GramerKurallar.FindAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            if (file == null || file.Length == 0)
                return BadRequest("Dosya bulunamadı.");

            try
            {
                var url = await _imageHelper.UploadCover(CategoryId, id, file);

                tema.KapakResmiUrl = url;
                await _context.SaveChangesAsync();

                return Ok(new { kapakUrl = url });
            }
            catch (Exception ex)
            {
                return BadRequest($"Resim yükleme hatası: {ex.Message}");
            }
        }

        // ----------------------------------------------------
        // 📌 DETAY GALERİ RESMİ YÜKLE
        // ----------------------------------------------------
        [HttpPost("{id}/upload-details")]
        public async Task<IActionResult> UploadDetails(int id, List<IFormFile> files)
        {
            var tema = await _context.KelimeTemalari
                .Include(t => t.DetayResimler)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            try
            {
                var urls = await _imageHelper.UploadGallery(CategoryId, id, files);

                foreach (var url in urls)
                {
                    tema.DetayResimler.Add(new TemaResim
                    {
                        OwnerId = id,
                        Category = CategoryId,
                        ResimUrl = url
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(urls);
            }
            catch (Exception ex)
            {
                return BadRequest($"Resim yükleme hatası: {ex.Message}");
            }
        }


        // ----------------------------------------------------
        // 📌 TEK DETAY RESMİ SİL
        // ----------------------------------------------------
        [HttpDelete("{id}/details")]
        public async Task<IActionResult> DeleteDetail(int id, [FromQuery] string url)
        {
            var image = await _context.TemaResimleri
                .FirstOrDefaultAsync(x =>
                    x.OwnerId == id &&
                    x.Category == CategoryId &&
                    x.ResimUrl == url);

            if (image == null)
                return NotFound("Görsel bulunamadı");

            _imageHelper.DeletePhysical(url);

            _context.TemaResimleri.Remove(image);
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
