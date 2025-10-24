using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KonuDto;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("api/admin/konular")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class KonuController :ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKonu _repository;

        public KonuController(ApplicationDbContext context, IKonu repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var konular = await _repository.GetAllAsync();
            var konularDto = konular.Select(t => t.ToKonuListDto());
            return Ok(konularDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var konu = await _repository.GetByIdAsync(id);
            if (konu == null)
            {
                return null;
            }
            return Ok(konu.ToKonuListDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKonu([FromBody] KonuRequest request, [FromRoute] int id)
        {
            var konuModel = await _repository.GetByIdAsync(id);
            if (konuModel == null)
            {
                return NotFound();
            }
            var updatedKonu = await _repository.UpdateAsync(id, request);
            return Ok(updatedKonu.ToKonuListDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateKonu([FromBody] KonuRequest request)
        {
            var konuModel = request.CreateKonuDto();
            await _repository.CreateAsync(konuModel);
            return CreatedAtAction(nameof(GetById), new { id = konuModel.Id }, konuModel.ToKonuListDto());
        }
        

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKonu([FromRoute] int id)
        {
            var konuModel = await _repository.GetByIdAsync(id);

            if (konuModel == null )
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
       
    }
}