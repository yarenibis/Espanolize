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
    public class OrnekController : ControllerBase
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
            try
            {
                var ornekler = await _repository.GetAllAsync();
                var orneklerDto = ornekler.Select(m => m.ToOrnekListDto());
                return Ok(orneklerDto);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            try
            {
                var ornek = await _repository.GetByIdAsync(id);
                if (ornek == null)
                {
                    return NotFound();
                }
                return Ok(ornek.ToOrnekListDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKonu([FromBody] OrnekRequest request, [FromRoute] int id)
        {
            try
            {
                var ornek = await _repository.GetByIdAsync(id);
                if (ornek == null)
                {
                    return NotFound();
                }
                var updatedModel = await _repository.UpdateAsync(id, request);
                return Ok(updatedModel.ToOrnekListDto());
            }
            catch (Exception ex)
            {
                // logging burada da yapılabilir
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrnek([FromBody] OrnekRequest request)
        {
            try
            {
                var createdDto = request.CreateOrnekDto();
                var createdOrnek = await _repository.CreateAsync(createdDto);
                return CreatedAtAction(nameof(GetById), new { id = createdOrnek.Id }, createdOrnek.ToOrnekListDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrnek([FromRoute] int id)
        {
            try
            {
                var ornekModel = await _repository.GetByIdAsync(id);

                if (ornekModel == null)
                {
                    return NotFound();
                }

                await _repository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // logging burada da yapılabilir
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}