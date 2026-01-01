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
using System.Security;


[Route("api/admin/tema")]
[ApiController]
[Authorize(Roles = "Admin")]
public class TemaController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    private const long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static readonly string[] ALLOWED_TYPES = { "image/jpeg", "image/png", "image/webp" };

    public TemaController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    private string UploadRoot =>
        Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "themes");

    private string BuildPublicUrl(string relativePath)
        => $"{Request.Scheme}://{Request.Host}{relativePath.Replace("\\", "/")}";

    private string SafeCombine(params string[] paths)
    {
        var full = Path.GetFullPath(Path.Combine(paths));
        if (!full.StartsWith(UploadRoot))
            throw new SecurityException("Geçersiz dosya yolu");
        return full;
    }

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var temalar = await _context.Temalar.AsNoTracking().ToListAsync();
        return Ok(temalar.Select(t => t.ToTemaListDto()));
    }

    // ================= CREATE =================
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TemaRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var tema = req.ToTema();
        _context.Temalar.Add(tema);
        await _context.SaveChangesAsync();

        return Ok(tema.ToTemaListDto());
    }

    // ================= UPLOAD COVER =================
    [HttpPost("{id}/upload-cover")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadCover(int id, [FromForm] UploadCoverRequest request)
    {
        var file = request.File;
        var tema = await _context.Temalar.FindAsync(id);
        if (tema == null) return NotFound();

        ValidateImage(file);

        var dir = SafeCombine(UploadRoot, id.ToString());
        Directory.CreateDirectory(dir);

        var fileName = $"cover_{Guid.NewGuid():N}.webp";
        var physicalPath = Path.Combine(dir, fileName);

        await SaveAsWebp(file, physicalPath);

        tema.KapakResmiUrl = BuildPublicUrl($"/uploads/themes/{id}/{fileName}");
        await _context.SaveChangesAsync();

        return Ok(tema.ToTemaListDto());
    }

    // ================= UPLOAD DETAILS =================
    [HttpPost("{id}/upload-details")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDetails(int id, [FromForm] UploadDetailsRequest request)
    {
        var files = request.Files;
        if (files == null || files.Count == 0)
            return BadRequest("Dosya yok.");

        var tema = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tema == null) return NotFound();

        var dir = SafeCombine(UploadRoot, id.ToString(), "gallery");
        Directory.CreateDirectory(dir);

        foreach (var file in files)
        {
            ValidateImage(file);

            var name = $"img_{Guid.NewGuid():N}.webp";
            var phys = Path.Combine(dir, name);

            await SaveAsWebp(file, phys);

            tema.DetayResimler.Add(new TemaResim
            {
                TemaId = id,
                ResimUrl = BuildPublicUrl($"/uploads/themes/{id}/gallery/{name}")
            });
        }

        await _context.SaveChangesAsync();
        return Ok(tema.ToTemaDetayDto());
    }

    // ================= DELETE =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTema(int id)
    {
        var tema = await _context.Temalar
            .Include(t => t.DetayResimler)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tema == null) return NotFound();

        var folder = SafeCombine(UploadRoot, id.ToString());
        if (Directory.Exists(folder))
            Directory.Delete(folder, true);

        _context.RemoveRange(tema.DetayResimler);
        _context.Temalar.Remove(tema);

        await _context.SaveChangesAsync();
        return Ok();
    }

    // ================= HELPERS =================
    private void ValidateImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Dosya boş");

        if (file.Length > MAX_FILE_SIZE)
            throw new ArgumentException("Dosya çok büyük");

        if (!ALLOWED_TYPES.Contains(file.ContentType))
            throw new ArgumentException("Geçersiz dosya türü");
    }

    private async Task SaveAsWebp(IFormFile file, string path)
    {
        using var stream = file.OpenReadStream();
        using var image = new MagickImage(stream);

        image.Strip();
        image.Quality = 75;

        await image.WriteAsync(path, MagickFormat.WebP);
    }
}
