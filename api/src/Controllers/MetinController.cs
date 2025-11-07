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
    [Route("/api/admin/metinler")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MetinController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMetin _repository;

        public MetinController(ApplicationDbContext context, IMetin repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var metinler = await _repository.GetAllAsync();
            var metinlerDto = metinler.Select(m => m.ToMetinListDto());
            return Ok(metinlerDto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var metin = await _repository.GetByIdAsync(id);
            if (metin == null)
            {
                return null;
            }
            return Ok(metin.ToMetinListDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMetin([FromBody] MetinRequest request, [FromRoute] int id)
        {
            var metin = await _repository.GetByIdAsync(id);
            if (metin == null)
            {
                return null;
            }
            var updatedModel = await _repository.UpdateAsync(id, request);
            return Ok(updatedModel.ToMetinListDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateMetin([FromBody] MetinRequest request)
        {
            var createdDto = request.CreateMetin();
            var createdMetin = await _repository.CreateAsync(createdDto);
            return CreatedAtAction(nameof(GetById), new { id = createdMetin.Id }, createdMetin.ToMetinListDto());

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMetin([FromRoute] int id)
        {
            var metinModel = await _repository.GetByIdAsync(id);

            if (metinModel == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}