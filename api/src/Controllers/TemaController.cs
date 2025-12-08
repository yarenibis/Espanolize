using Microsoft.AspNetCore.Mvc;
using api.src.Data;
using api.src.Models;
using api.src.Dtos.AdminDtos;
using api.src.Mapper.AdminMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using api.src.Mapper.KullanıcıMapper;

[Route("api/admin/tema")]
[ApiController]
[Authorize(Roles = "Admin")]
public class TemaController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public TemaController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }


    private string UploadRoot =>
        Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "themes");

    private string BuildPublicUrl(string relativePath)
        => $"{Request.Scheme}://{Request.Host}{relativePath.Replace("\\", "/")}";

    private string GetPhysicalPathFromUrl(string fullUrl)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}/";
        var relative = fullUrl.Replace(baseUrl, "").Replace("/", Path.DirectorySeparatorChar.ToString());
        return Path.Combine(_env.WebRootPath ?? "", relative);
    }

    // ----------------- 📜 TÜM TEMALAR -----------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var temalar = await _context.Temalar.ToListAsync();
        return Ok(temalar.Select(t => t.ToTemaListDto()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tema = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tema == null) return NotFound();

        return Ok(tema.ToTemaDetayDto());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TemaRequest req)
    {
        var tema = req.ToTema();
        _context.Temalar.Add(tema);
        await _context.SaveChangesAsync();

        return Ok(tema.ToTemaListDto());
    }

    // ----------------- 🖼️ KAPAK RESMİ YÜKLE -----------------
    [HttpPost("{id}/upload-cover")]
    public async Task<IActionResult> UploadCover([FromRoute] int id, IFormFile file)
    {
        var tema = await _context.Temalar.FindAsync(id);
        if (tema == null) return NotFound();
        if (file == null || file.Length == 0) return BadRequest("Dosya yok.");

        var dir = Path.Combine(UploadRoot, id.ToString());
        Directory.CreateDirectory(dir);

        var ext = Path.GetExtension(file.FileName);
        var name = $"cover_{Guid.NewGuid():N}{ext}";
        var phys = Path.Combine(dir, name);

        using (var fs = System.IO.File.Create(phys))
            await file.CopyToAsync(fs);

        var relativePath = $"/uploads/themes/{id}/{name}";
        tema.KapakResmiUrl = BuildPublicUrl(relativePath);

        await _context.SaveChangesAsync();

        var full = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstAsync(t => t.Id == id);

        return Ok(full.ToTemaDetayDto());
    }

    // ----------------- 🖼️ ÇOKLU DETAY GÖRSEL YÜKLE -----------------
    [HttpPost("{id}/upload-details")]
    public async Task<IActionResult> UploadDetails([FromRoute] int id, List<IFormFile> files)
    {
        var tema = await _context.Temalar.Include(t => t.DetayResimler)
                                         .FirstOrDefaultAsync(t => t.Id == id);
        if (tema == null) return NotFound();
        if (files == null || files.Count == 0) return BadRequest("Dosya yok.");

        var dir = Path.Combine(UploadRoot, id.ToString(), "gallery");
        Directory.CreateDirectory(dir);

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            var ext = Path.GetExtension(file.FileName);
            var name = $"img_{Guid.NewGuid():N}{ext}";
            var phys = Path.Combine(dir, name);

            using var fs = System.IO.File.Create(phys);
            await file.CopyToAsync(fs);

            var relativePath = $"/uploads/themes/{id}/gallery/{name}";
            tema.DetayResimler.Add(new TemaResim
            {
                TemaId = id,
                ResimUrl = BuildPublicUrl(relativePath)
            });
        }

        await _context.SaveChangesAsync();

        var updated = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstAsync(t => t.Id == id);

        return Ok(updated.ToTemaDetayDto());
    }

    // ----------------- 🧹 KAPAK TEMİZLE -----------------
    [HttpDelete("{id}/cover")]
    public async Task<IActionResult> RemoveCover([FromRoute] int id)
    {
        var tema = await _context.Temalar.FindAsync(id);
        if (tema == null) return NotFound();

        if (!string.IsNullOrWhiteSpace(tema.KapakResmiUrl))
        {
            var phys = GetPhysicalPathFromUrl(tema.KapakResmiUrl);
            if (System.IO.File.Exists(phys))
                System.IO.File.Delete(phys);

            tema.KapakResmiUrl = null;
            await _context.SaveChangesAsync();
        }

        var dto = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstAsync(t => t.Id == id);

        return Ok(dto.ToTemaDetayDto());
    }

    // ----------------- 🗑️ GALERİDEN TEK GÖRSEL SİL -----------------
    [HttpDelete("{id}/details")]
    public async Task<IActionResult> DeleteDetail([FromRoute] int id, [FromQuery] string url)
    {
        var tema = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstOrDefaultAsync(t => t.Id == id);
        if (tema == null) return NotFound();

        var item = tema.DetayResimler.FirstOrDefault(r => r.ResimUrl == url);
        if (item == null) return NotFound();

        var phys = GetPhysicalPathFromUrl(item.ResimUrl);
        if (System.IO.File.Exists(phys))
            System.IO.File.Delete(phys);

        _context.TemaResimleri.Remove(item);
        await _context.SaveChangesAsync();

        var dto = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstAsync(t => t.Id == id);

        return Ok(dto.ToTemaDetayDto());
    }

    // ----------------- 🧨 TÜM TEMA VE DOSYALARI SİL -----------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTema([FromRoute] int id)
    {
        var tema = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tema == null)
            return NotFound("Tema bulunamadı.");

        // 📁 Fiziksel klasörü sil
        var themeFolder = Path.Combine(UploadRoot, id.ToString());
        if (Directory.Exists(themeFolder))
        {
            try { Directory.Delete(themeFolder, recursive: true); }
            catch (Exception ex) { Console.WriteLine($"Klasör silinirken hata: {ex.Message}"); }
        }

        // 📦 DB'den kayıtları sil
        if (tema.DetayResimler.Any())
            _context.TemaResimleri.RemoveRange(tema.DetayResimler);

        _context.Temalar.Remove(tema);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tema ve tüm resimler başarıyla silindi." });
    }
}