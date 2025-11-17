using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Helpers;
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
        private readonly ImageUploadHelper _imageHelper;
        private readonly ApplicationDbContext _context;

        public MetinTemaController(
            ApplicationDbContext context, 
            IMetinTema repository,
            ImageUploadHelper imageHelper)
        {
            _context = context;
            _repository = repository;
            _imageHelper = imageHelper;
        }

        // ----------------------------------------------------
        // 📌 TÜM METİN TEMALARINI GETİR
        // ----------------------------------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var temalar = await _repository.GetAllAsync();
            var temaDtos = temalar.Select(s => s.ToMetinTemaListDto());
            return Ok(temaDtos);
        }

        // ----------------------------------------------------
        // 📌 TEK METİN TEMASI GETİR
        // ----------------------------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile metin teması bulunamadı");

            return Ok(tema.ToMetinTemaDetayDto());
        }

        // ----------------------------------------------------
        // 📌 YENİ METİN TEMASI OLUŞTUR
        // ----------------------------------------------------
        [HttpPost]
        public async Task<IActionResult> CreateTema([FromBody] MetinTemaRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var temaModel = request.CreateMetinDto();
            await _repository.CreateAsync(temaModel);

            return CreatedAtAction(
                nameof(GetById), 
                new { id = temaModel.Id }, 
                temaModel.ToMetinTemaListDto()
            );
        }

        // ----------------------------------------------------
        // 📌 METİN TEMASI GÜNCELLE
        // ----------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTema([FromRoute] int id, [FromBody] MetinTemaRequest updatedModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tema = await _repository.GetByIdAsync(id);
            if (tema == null)
                return NotFound($"ID {id} ile metin teması bulunamadı");

            var updatedTema = await _repository.UpdateAsync(id, updatedModel);
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