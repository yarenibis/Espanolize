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
    [Route("/api/admin/metin-temalari")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MetinTemaController : ControllerBase
    {
        private readonly IMetinTema _repository;
        private readonly ImageUploadHelper _imageHelper;
        private readonly ApplicationDbContext _context;

        public MetinTemaController(
            ApplicationDbContext context, 
            IMetinTema repository,
            ImageUploadHelper imageHelper)
        {
            _context = context;
            _repository = repository;
            _imageHelper = imageHelper;
        }

        // ----------------------------------------------------
        // 📌 TÜM METİN TEMALARINI GETİR
        // ----------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temaDtos = temalar.Select(s => s.ToMetinTemaListDto());
            return Ok(temaDtos);
        }

        // ----------------------------------------------------
        // 📌 TEK METİN TEMASI GETİR
        // ----------------------------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile metin teması bulunamadı");

            return Ok(tema.ToMetinTemaDetayDto());
        }

        // ----------------------------------------------------
        // 📌 YENİ METİN TEMASI OLUŞTUR
        // ----------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> CreateTema([FromBody] MetinTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var temaModel = request.CreateMetinDto();
            await _repository.CreateAsync(temaModel);

            return CreatedAtAction(
                nameof(GetById), 
                new { id = temaModel.Id }, 
                temaModel.ToMetinTemaListDto()
            );
        }

        // ----------------------------------------------------
        // 📌 METİN TEMASI GÜNCELLE
        // ----------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTema([FromRoute] int id, [FromBody] MetinTemaRequest updatedModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile metin teması bulunamadı");

            var updatedTema = await _repository.UpdateAsync(id, updatedModel);
            return Ok(updatedTema.ToMetinTemaListDto());
        }

       // ----------------------------------------------------
// 📌 METİN TEMASI SİL (RESİMLERLE BİRLİKTE)
// ----------------------------------------------------
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteMetinTema([FromRoute] int id)
{
    var tema = await _context.MetinTemalari
        .Include(t => t.DetayResimler)
        .FirstOrDefaultAsync(t => t.Id == id);

    if (tema == null)
        return NotFound($"ID {id} ile metin teması bulunamadı");

    // 📁 Klasörü sil (ImageCategory yerine integer)
    int category = 2; // Metin = 2

    _imageHelper.DeleteCategoryFolder(category, id);

    // 📦 DB’den Tema + Resimleri sil
    if (tema.DetayResimler.Any())
        _context.TemaResimleri.RemoveRange(tema.DetayResimler);

    _context.MetinTemalari.Remove(tema);
    await _context.SaveChangesAsync();

    return NoContent();
}

        // ----------------------------------------------------
// 📌 KAPAK RESMİ YÜKLE
// ----------------------------------------------------
[HttpPost("{id}/upload-cover")]
public async Task<IActionResult> UploadCover(int id, IFormFile file)
{
    var tema = await _context.MetinTemalari.FindAsync(id);
    if (tema == null)
        return NotFound($"ID {id} ile metin teması bulunamadı");

    if (file == null || file.Length == 0)
        return BadRequest("Dosya bulunamadı.");

    int category = 2; // Metin

    try
    {
        var url = await _imageHelper.UploadCover(category, id, file);

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
// 📌 DETAY GALERİ RESİMLERİ YÜKLE
// ----------------------------------------------------
[HttpPost("{id}/upload-details")]
public async Task<IActionResult> UploadDetails(int id, [FromQuery] int category, List<IFormFile> files)
{
    var model = await _context.GramerKurallar
        .Include(g => g.DetayResimler)
        .FirstOrDefaultAsync(g => g.Id == id);

    if (model == null)
        return NotFound();

    if (files == null || files.Count == 0)
        return BadRequest("Dosya yok.");

    // Upload klasör: /uploads/{category}/{id}/gallery
    var urls = await _imageHelper.UploadGallery(category, id, files);

    foreach (var url in urls)
    {
        model.DetayResimler.Add(new TemaResim
        {
            OwnerId = id,
            Category = category,   // ❗ integer kaydediyoruz
            ResimUrl = url
        });
    }

    await _context.SaveChangesAsync();

    return Ok(urls);
}


       // ----------------------------------------------------
// 📌 TEK DETAY RESMİ SİL
// ----------------------------------------------------
[HttpDelete("{id}/details")]
public async Task<IActionResult> DeleteDetail(int id, [FromQuery] int category, [FromQuery] string url)
{
    var image = await _context.TemaResimleri
        .FirstOrDefaultAsync(x =>
            x.OwnerId == id &&
            x.Category == category && // ❗ integer Category
            x.ResimUrl == url);

    if (image == null)
        return NotFound("Görsel bulunamadı");

    // Fiziksel dosya sil
    _imageHelper.DeletePhysical(url);

    // Veritabanından sil
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
            var tema = await _context.MetinTemalari.FindAsync(id);
            if (tema == null || string.IsNullOrEmpty(tema.KapakResmiUrl))
                return NotFound("Kapak resmi bulunamadı");

            try
            {
                // Fiziksel dosyayı sil
                _imageHelper.DeletePhysical(tema.KapakResmiUrl);

                // DB'den URL'yi temizle
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