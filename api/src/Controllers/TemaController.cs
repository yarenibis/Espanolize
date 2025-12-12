using Microsoft.AspNetCore.Mvc;
using api.src.Data;
using api.src.Models;
using api.src.Dtos.AdminDtos;
using api.src.Mapper.AdminMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using api.src.Mapper.KullanıcıMapper;
using ImageMagick;
using ImageMagick.Formats;

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

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var temalar = await _context.Temalar.ToListAsync();
            return Ok(temalar.Select(t => t.ToTemaListDto()));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Temalar alınırken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= GET BY ID =================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var tema = await _context.Temalar.Include(t => t.DetayResimler)
                                             .FirstOrDefaultAsync(t => t.Id == id);

            if (tema == null)
                return NotFound("Tema bulunamadı.");

            return Ok(tema.ToTemaDetayDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Tema getirilirken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= CREATE =================
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TemaRequest req)
    {
        try
        {
            var tema = req.ToTema();
            _context.Temalar.Add(tema);
            await _context.SaveChangesAsync();

            return Ok(tema.ToTemaListDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Tema oluşturulurken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= UPLOAD COVER =================
    [HttpPost("{id}/upload-cover")]
    public async Task<IActionResult> UploadCover(int id, IFormFile file)
    {
        try
        {
            var tema = await _context.Temalar.FindAsync(id);
            if (tema == null) return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("Dosya yok.");

            var dir = Path.Combine(UploadRoot, id.ToString());
            Directory.CreateDirectory(dir);

            var name = $"cover_{Guid.NewGuid():N}.webp";
            var phys = Path.Combine(dir, name);

            using (var input = file.OpenReadStream())
            using (var image = new MagickImage(input))
            {
                var define = new WebPWriteDefines { AlphaQuality = 75, Lossless = false };
                image.Write(phys, define);
            }

            var relative = $"/uploads/themes/{id}/{name}";
            tema.KapakResmiUrl = BuildPublicUrl(relative);

            await _context.SaveChangesAsync();

            var full = await _context.Temalar.Include(t => t.DetayResimler)
                                             .FirstAsync(t => t.Id == id);

            return Ok(full.ToTemaDetayDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Kapak yüklenirken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= UPLOAD DETAILS (MULTIPLE) =================
    [HttpPost("{id}/upload-details")]
    public async Task<IActionResult> UploadDetails(int id, List<IFormFile> files)
    {
        try
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

                var name = $"img_{Guid.NewGuid():N}.webp";
                var phys = Path.Combine(dir, name);

                using (var input = file.OpenReadStream())
                using (var image = new MagickImage(input))
                {
                    var define = new WebPWriteDefines { AlphaQuality = 75, Lossless = false };
                    image.Write(phys, define);
                }

                var relative = $"/uploads/themes/{id}/gallery/{name}";

                tema.DetayResimler.Add(new TemaResim
                {
                    TemaId = id,
                    ResimUrl = BuildPublicUrl(relative)
                });
            }

            await _context.SaveChangesAsync();

            var dto = await _context.Temalar.Include(t => t.DetayResimler)
                                            .FirstAsync(t => t.Id == id);

            return Ok(dto.ToTemaDetayDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Detay görseller yüklenirken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= DELETE COVER =================
    [HttpDelete("{id}/cover")]
    public async Task<IActionResult> RemoveCover(int id)
    {
        try
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

            var dto = await _context.Temalar.Include(t => t.DetayResimler)
                                            .FirstAsync(t => t.Id == id);

            return Ok(dto.ToTemaDetayDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Kapak silinirken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= DELETE GALLERY ITEM =================
    [HttpDelete("{id}/details")]
    public async Task<IActionResult> DeleteDetail(int id, [FromQuery] string url)
    {
        try
        {
            var tema = await _context.Temalar.Include(t => t.DetayResimler)
                                             .FirstOrDefaultAsync(t => t.Id == id);

            if (tema == null) return NotFound();

            var item = tema.DetayResimler.FirstOrDefault(r => r.ResimUrl == url);
            if (item == null) return NotFound();

            var phys = GetPhysicalPathFromUrl(item.ResimUrl);
            if (System.IO.File.Exists(phys))
                System.IO.File.Delete(phys);

            _context.TemaResimleri.Remove(item);
            await _context.SaveChangesAsync();

            var dto = await _context.Temalar.Include(t => t.DetayResimler)
                                            .FirstAsync(t => t.Id == id);

            return Ok(dto.ToTemaDetayDto());
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Detay görsel silinirken hata oluştu.", detail = ex.Message });
        }
    }

    // ================= DELETE FULL THEME =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTema(int id)
    {
        try
        {
            var tema = await _context.Temalar.Include(t => t.DetayResimler)
                                             .FirstOrDefaultAsync(t => t.Id == id);

            if (tema == null)
                return NotFound("Tema bulunamadı.");

            var themeFolder = Path.Combine(UploadRoot, id.ToString());
            if (Directory.Exists(themeFolder))
                Directory.Delete(themeFolder, recursive: true);

            if (tema.DetayResimler.Any())
                _context.TemaResimleri.RemoveRange(tema.DetayResimler);

            _context.Temalar.Remove(tema);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tema ve tüm resimler başarıyla silindi." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Tema silinirken hata oluştu.", detail = ex.Message });
        }
    }
}
