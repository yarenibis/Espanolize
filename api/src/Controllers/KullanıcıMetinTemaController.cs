using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Interface;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("/api/metinTema")]
    [ApiController]
    public class KullanıcıMetinTemaController :ControllerBase
    {
        private readonly IMetinTema _repository;

        public KullanıcıMetinTemaController(IMetinTema repository)
        {
            _repository = repository;
        }

      
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var dto = temalar.Select(t => t.ToMetinTemaListDto()); // sadece başlık, açıklama vs.
            return Ok(dto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var temalar = await _repository.GetByIdWithMetinlerAsync(id);
            if (temalar == null)
            {
                return NotFound();
            }
            return Ok(temalar.ToMetinTemaDetayDto());
        }
    }
}