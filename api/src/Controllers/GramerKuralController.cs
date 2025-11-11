using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Interface;
using api.src.Mapper.AdminMapper;
using api.src.Mapper.KullanıcıMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{
    [Route("api/admin/gramerkurallar")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class GramerKuralController :ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGramer _repository;

        public GramerKuralController(ApplicationDbContext context, IGramer repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var kurallar = await _repository.GetAllAsync();
            var kurallarDto = kurallar.Select(s => s.ToGramerKuralListDto());
            return Ok(kurallarDto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var kural = await _repository.GetByIdAsync(id);
            if (kural == null)
            {
                return null;
            }
            return Ok(kural.ToGramerKuralListDto());
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKural([FromBody] GramerKuralRequest request, [FromRoute] int id)
        {
            var kuralModel = await _repository.GetByIdAsync(id);
            if (kuralModel == null)
            {
                return NotFound();
            }
            var updatedKural = await _repository.UpdateAsync(id, request);
            return Ok(updatedKural.ToGramerKuralListDto());
        }




        [HttpPost]
        public async Task<IActionResult> CreateKural([FromBody] GramerKuralRequest request)
        {
            var kuralModel = request.CreateGramerKuralDto();
            await _repository.CreateAsync(kuralModel);
            return CreatedAtAction(nameof(GetById), new { id = kuralModel.Id }, kuralModel.ToGramerKuralListDto());
        }
        

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKural([FromRoute] int id)
        {
            var kuralModel = await _repository.GetByIdAsync(id);

            if (kuralModel == null )
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
      
    }
}