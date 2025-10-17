using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Interface;
using api.src.Mapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.src.Controllers
{

    [Route("api/kullanici/kategoriler")]
    [ApiController]
    public class KullanıcıKategoriController :ControllerBase
    {


        private readonly ApplicationDbContext _context;
        private readonly IKategori _repository;

        public KullanıcıKategoriController(ApplicationDbContext context, IKategori repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
        var kategoriler = await _repository.GetAllWithKonularAsync();
        
        var kategoridto = kategoriler.Select(s => s.ToKategoriDetayDto());
        return Ok(kategoridto);
    }
    }
}