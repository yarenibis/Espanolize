using System;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace api.src.Controllers
{
    [Route("api/tema")]
    [ApiController]
    public class KullanıcıTemaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<KullanıcıTemaController> _logger;

        public KullanıcıTemaController(ApplicationDbContext context, ILogger<KullanıcıTemaController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // -------------------- 📌 TÜM TEMALAR --------------------
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
                _logger.LogError(ex, "Tema listesi alınırken hata oluştu.");
                return StatusCode(500, "Sunucu hatası: Bir hata oluştu.Tekrar deneyiniz.");
            }
        }

        // -------------------- 📌 ID'YE GÖRE DETAY --------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var tema = await _context.Temalar
                    .Include(t => t.DetayResimler)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (tema == null)
                    return NotFound("Tema bulunamadı.");

                return Ok(tema.ToTemaDetayDto());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Tema detay alınırken hata oluştu. Tema Id: {id}");
                return StatusCode(500, "Sunucu hatası: Bir hata oluştu.Tekrar deneyiniz.");
            }
        }
    }
}
