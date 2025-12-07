using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.src.Controllers
{
    [Route("api/tema")]
    [ApiController]
    public class KullanıcıTemaController:ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KullanıcıTemaController(ApplicationDbContext context)
        {
            _context = context;
        }
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
    }
}