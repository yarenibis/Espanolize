using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.src.Data;
using api.src.Interface;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

namespace api.src.Controllers
{
    [Route("api/admin/gramerkurallar")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class GramerKuralController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGramer _repository;

        public GramerKuralController(
            ApplicationDbContext context,
            IGramer repository
            )
        {
            _context = context;
            _repository = repository;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = await _repository.GetAllAsync();
                return Ok(list.Select(x => x.ToGramerKuralListDto()));
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
                var kural = await _repository.GetByIdAsync(id);
                if (kural == null)
                    return NotFound();

                return Ok(kural.ToGramerKuralDetayDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreateKural([FromBody] GramerKuralRequest request)
        {
            try
            {
                var model = request.CreateGramerKuralDto();
                await _repository.CreateAsync(model);

                return CreatedAtAction(nameof(GetById),
                    new { id = model.Id },
                    model.ToGramerKuralListDto());

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKural(int id, [FromBody] GramerKuralRequest request)
        {
            try
            {
                var model = await _repository.GetByIdAsync(id);
                if (model == null)
                    return NotFound();

                var updated = await _repository.UpdateAsync(id, request);
                return Ok(updated.ToGramerKuralListDto());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKural([FromRoute] int id)
        {
            try
            {
                var konuModel = await _repository.GetByIdAsync(id);

                if (konuModel == null)
                {
                    return NotFound();
                }

                await _repository.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
