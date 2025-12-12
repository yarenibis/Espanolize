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
    [Route("api/kurallar")]
    [ApiController]
    public class KullanıcıGramerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGramer _repository;

        public KullanıcıGramerController(ApplicationDbContext context, IGramer repository)
        {
            _context = context;
            _repository = repository;
        }



        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var kurallar = await _repository.GetAllWithOrneklerAsync();
            var dto = kurallar.Select(t => t.ToGramerKuralListDto()); // sadece başlık, açıklama vs.
            return Ok(dto);
        }



    }
}