using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Helpers;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.src.Controllers
{
    [Route("/api/admin/kelime-temalari")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class KelimeTemaController : ControllerBase
    {
        private readonly IKelimeTema _repository;
        private readonly ImageUploadHelper _imageHelper;
        private readonly ApplicationDbContext _context;
        private const int CategoryId = 1;

        public KelimeTemaController(
            IKelimeTema repository, 
            ImageUploadHelper imageHelper,
            ApplicationDbContext context)
        {
            _repository = repository;
            _imageHelper = imageHelper;
            _context = context;
        }

        // ----------------------------------------------------
        // 📌 TÜM TEMALARI GETİR
        // ----------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temaDtos = temalar.Select(t => t.ToKelimeTemaListDto());
            return Ok(temaDtos);
        }

        // ----------------------------------------------------
        // 📌 TEK TEMA GETİR
        // ----------------------------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(tema.ToKelimeTemaDetayDto());
        }

        // ----------------------------------------------------
        // 📌 YENİ TEMA OLUŞTUR
        // ----------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> CreateTema([FromBody] KelimeTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var temaModel = request.CreateKelimeTemaDto();
            await _repository.CreateAsync(temaModel);

            return CreatedAtAction(
                nameof(GetById), 
                new { id = temaModel.Id }, 
                temaModel.ToKelimeTemaListDto()
            );
        }

        // ----------------------------------------------------
        // 📌 TEMA GÜNCELLE
        // ----------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTema([FromRoute] int id, [FromBody] KelimeTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTema = await _repository.UpdateAsync(id, request);
            if (updatedTema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(updatedTema.ToKelimeTemaListDto());
        }

        // ----------------------------------------------------
        // 📌 KELİME TEMA SİL (resimlerle birlikte)
        // ----------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKelimeTema([FromRoute] int id)
        {
            var tema = await _context.KelimeTemalari
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
            var tema = await _context.KelimeTemalari.FindAsync(id);
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


        // ----------------------------------------------------
        // 📌 KAPAK RESMİ SİL
        // ----------------------------------------------------
        [HttpDelete("{id}/cover")]
        public async Task<IActionResult> DeleteCover(int id)
        {
            var tema = await _context.KelimeTemalari.FindAsync(id);
            if (tema == null || string.IsNullOrEmpty(tema.KapakResmiUrl))
                return NotFound("Kapak resmi bulunamadı");

            try
            {
                _imageHelper.DeletePhysical(tema.KapakResmiUrl);

                tema.KapakResmiUrl = null;
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Kapak resmi silme hatası: {ex.Message}");
            }
        }
    }
}