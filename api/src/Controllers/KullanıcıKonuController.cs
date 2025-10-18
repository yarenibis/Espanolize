using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Interface;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("api/konular")]
    [ApiController]
    public class KullanıcıKonuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKonu _repository;

        public KullanıcıKonuController(ApplicationDbContext context, IKonu repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var konular = await _repository.GetAllWithKurallarAsync();
            var konularDto = konular.Select(t => t.ToKonuDetayDto());
            return Ok(konularDto);
        }

    }
}