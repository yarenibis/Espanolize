using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KategoriDto;
using api.src.Interface;
using api.src.Mapper;
using api.src.Mapper.AdminMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("api/admin/kategoriler")]
    [ApiController]
//    [Authorize]
    public class KategoriController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IKategori _repository;

        public KategoriController(ApplicationDbContext context, IKategori repository)
        {
            _context = context;
            _repository = repository;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var kategoriler = await _repository.GetAllAsync();
            var kategoridto = kategoriler.Select(s => s.ToKategoriListDto());
            return Ok(kategoridto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var result = await _repository.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result.ToKategoriListDto());
        }


        [HttpPost]
        public async Task<IActionResult> CreateKategori([FromBody] KategoriRequest request)
        {
            var kategoriModel = request.CreateKategoriDto();
            await _repository.CreateAsync(kategoriModel);
            return CreatedAtAction(nameof(GetById), new { id = kategoriModel.Id }, kategoriModel.ToKategoriListDto());
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKategori([FromRoute] int id, [FromBody] KategoriRequest updatedModel)
        {
            var kategoriModel = await _repository.GetByIdAsync(id);
            if (kategoriModel == null)
            {
                return NotFound();
            }
            var updatedKategori = await _repository.UpdateAsync(id, updatedModel);
            return Ok(updatedKategori.ToKategoriListDto());
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKategori([FromRoute] int id)
        {
            var kategoriModel = await _repository.GetByIdAsync(id);

            if (kategoriModel == null )
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}