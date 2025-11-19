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
            //konu listesi
            var konular = await _repository.GetAllAsync();
            var konularDto = konular.Select(t => t.ToKonuListDto());
            return Ok(konularDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var konu = await _repository.GetByIdWithKurallarAsync(id);
            if (konu == null)
                return NotFound();

            return Ok(konu.ToKonuDetayDto());
        }

    }
}