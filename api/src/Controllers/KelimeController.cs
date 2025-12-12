using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KelimeDto;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("/api/admin/kelimeler")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class KelimeController :ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKelime _repository;

        public KelimeController(ApplicationDbContext context, IKelime repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try{
            var kelimeler = await _repository.GetAllAsync();
            var kelimelerDto = kelimeler.Select(m => m.ToKelimeListDto());
            return Ok(kelimelerDto);
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try{
            var kelime = await _repository.GetByIdAsync(id);
            if (kelime == null)
            {
                return NotFound();
            }
            return Ok(kelime.ToKelimeListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKelime([FromBody] KelimeRequest request, [FromRoute] int id)
        {
            try{
            var kelime = await _repository.GetByIdAsync(id);
            if (kelime == null)
            {
                return NotFound();
            }
            var updatedModel = await _repository.UpdateAsync(id, request);
            return Ok(updatedModel.ToKelimeListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrnek([FromBody] KelimeRequest request)
        {
            try{
            var createdDto = request.CreateKelimeDto();
            var createdKelime = await _repository.CreateAsync(createdDto);
            return CreatedAtAction(nameof(GetById), new { id = createdKelime.Id }, createdKelime.ToKelimeListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrnek([FromRoute] int id)
        {
            try{
            var ornekModel = await _repository.GetByIdAsync(id);

            if (ornekModel == null )
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}