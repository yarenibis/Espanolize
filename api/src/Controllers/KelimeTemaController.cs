using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.src.Controllers
{
    [Route("/api/admin/kelime-temalari")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class KelimeTemaController : ControllerBase
    {
        private readonly IKelimeTema _repository;
        private readonly ApplicationDbContext _context;

        public KelimeTemaController(
            IKelimeTema repository, 
            ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temaDtos = temalar.Select(t => t.ToKelimeTemaListDto());
            return Ok(temaDtos);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(tema.ToKelimeTemaListDto());
        }


        [HttpPost]
        public async Task<IActionResult> CreateTema([FromBody] KelimeTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var temaModel = request.CreateKelimeTemaDto();
            await _repository.CreateAsync(temaModel);

            return CreatedAtAction(
                nameof(GetById), 
                new { id = temaModel.Id }, 
                temaModel.ToKelimeTemaListDto()
            );
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTema([FromRoute] int id, [FromBody] KelimeTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTema = await _repository.UpdateAsync(id, request);
            if (updatedTema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(updatedTema.ToKelimeTemaListDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKelimeTema([FromRoute] int id)
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