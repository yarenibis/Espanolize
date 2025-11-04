using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("/api/admin/kelimeTema")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class KelimeTemaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKelimeTema _repository;

        public KelimeTemaController(ApplicationDbContext context, IKelimeTema repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temadto = temalar.Select(s => s.ToKelimeTemaListDto());
            return Ok(temadto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _repository.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result.ToKelimeTemaListDto());
        }


        [HttpPost]
        public async Task<IActionResult> CreateKategori([FromBody] KelimeTemaRequest request)
        {
            var temaModel = request.CreateKelimeTemaDto();
            await _repository.CreateAsync(temaModel);
            return CreatedAtAction(nameof(GetById), new { id = temaModel.Id }, temaModel.ToKelimeTemaListDto());
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKategori([FromRoute] int id, [FromBody] KelimeTemaRequest updatedModel)
        {
            var temaModel = await _repository.GetByIdAsync(id);
            if (temaModel == null)
            {
                return NotFound();
            }
            var updatedKategori = await _repository.UpdateAsync(id, updatedModel);
            return Ok(updatedKategori.ToKelimeTemaListDto());
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKategori([FromRoute] int id)
        {
            var temaModel = await _repository.GetByIdAsync(id);

            if (temaModel == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }

    }
}