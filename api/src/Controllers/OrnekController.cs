using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.OrnekDto;
using api.src.Interface;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [ApiController]
    [Route("/api/admin/ornekler")]
    public class OrnekController :ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOrnek _repository;

        public OrnekController(ApplicationDbContext context, IOrnek repository)
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


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var ornek = await _repository.GetByIdAsync(id);
            if (ornek == null)
            {
                return null;
            }
            return Ok(ornek.ToOrnekListDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKonu([FromBody] OrnekRequest request, [FromRoute] int id)
        {
            var ornek = await _repository.GetByIdAsync(id);
            if (ornek == null)
            {
                return null;
            }
            var updatedModel = await _repository.UpdateAsync(id,request);
            return Ok(updatedModel.ToOrnekListDto());
        }


    }
}