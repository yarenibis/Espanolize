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
    [ApiController]
    [Route("/api/ornekler")]
    public class KullanıcıOrnekController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOrnek _repository;

        public KullanıcıOrnekController(ApplicationDbContext context, IOrnek repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ornekler = await _repository.GetAllAsync();
            var orneklerDto = ornekler.Select(m => m.ToOrnekListDto());
            return Ok(orneklerDto);
        }

    }
}