using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.KelimeDto;
using api.src.Models;

namespace api.src.Dtos.KullanıcıDtos
{
    public class KelimeTemaDetayDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string? Aciklama { get; set; }
        public List<KelimeListDto> Kelimeler { get; set; } = new();
    }
}