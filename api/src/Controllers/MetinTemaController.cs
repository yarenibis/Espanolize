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
    [Route("/api/admin/metin-temalari")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MetinTemaController : ControllerBase
    {
        private readonly IMetinTema _repository;
        private readonly ApplicationDbContext _context;

        public MetinTemaController(
            ApplicationDbContext context, 
            IMetinTema repository)
        {
            _context = context;
            _repository = repository;
        }

         [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temaDtos = temalar.Select(t => t.ToMetinTemaListDto());
            return Ok(temaDtos);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(tema.ToMetinTemaListDto());
        }


        [HttpPost]
        public async Task<IActionResult> CreateTema([FromBody] MetinTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var temaModel = request.CreateMetinTemaDto();
            await _repository.CreateAsync(temaModel);

            return CreatedAtAction(
                nameof(GetById), 
                new { id = temaModel.Id }, 
                temaModel.ToMetinTemaListDto()
            );
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTema([FromRoute] int id, [FromBody] MetinTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTema = await _repository.UpdateAsync(id, request);
            if (updatedTema == null)
                return NotFound($"ID {id} ile tema bulunamadı");

            return Ok(updatedTema.ToMetinTemaListDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMetinTema([FromRoute] int id)
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