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
            try{
            var metinler = await _repository.GetAllAsync();
            var metinlerDto = metinler.Select(m => m.ToMetinListDto());
            return Ok(metinlerDto);
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try{
            var metin = await _repository.GetByIdAsync(id);
            if (metin == null)
            {
                return null;
            }
            return Ok(metin.ToMetinListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMetin([FromBody] MetinRequest request, [FromRoute] int id)
        {
            try{
            var metin = await _repository.GetByIdAsync(id);
            if (metin == null)
            {
                return NotFound();
            }
            var updatedModel = await _repository.UpdateAsync(id, request);
            return Ok(updatedModel.ToMetinListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateMetin([FromBody] MetinRequest request)
        {
            try{
            var createdDto = request.CreateMetin();
            var createdMetin = await _repository.CreateAsync(createdDto);
            return CreatedAtAction(nameof(GetById), new { id = createdMetin.Id }, createdMetin.ToMetinListDto());
            }catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMetin([FromRoute] int id)
        {
            try{
            var metinModel = await _repository.GetByIdAsync(id);

            if (metinModel == null)
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