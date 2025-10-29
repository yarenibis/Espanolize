using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.OrnekDto;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{

    [Route("/api/admin/ornekler")]
    [ApiController]
    [Authorize(Roles = "Admin")]
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
            var updatedModel = await _repository.UpdateAsync(id, request);
            return Ok(updatedModel.ToOrnekListDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrnek([FromBody] OrnekRequest request)
        {
            var createdDto = request.CreateOrnekDto();
            var createdOrnek = await _repository.CreateAsync(createdDto);
            return CreatedAtAction(nameof(GetById), new { id = createdOrnek.Id }, createdOrnek.ToOrnekListDto());

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrnek([FromRoute] int id)
        {
            var ornekModel = await _repository.GetByIdAsync(id);

            if (ornekModel == null )
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }

    }
}