using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using api.src.Interface;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("api/kelimetemalari")]
    [ApiController]
    public class KullaniciKelimeTemaController : ControllerBase
    {
        private readonly IKelimeTema _repository;

        public KullaniciKelimeTemaController(IKelimeTema repository)
        {
            _repository = repository;
        }

        // /api/kelimetemalari
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var dto = temalar.Select(t => t.ToKelimeTemaListDto()); // sadece başlık, açıklama vs.
            return Ok(dto);
        }

        // /api/kelimetemalari/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var temalar = await _repository.GetAllWithKelimelerAsync(id);
            if (temalar == null)
            {
                return NotFound();
            }
            return Ok(temalar.ToKelimeTemaDetayDto());
        }
    }
}
