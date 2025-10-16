using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.KonuDto;

namespace api.src.Dtos.KullanıcıDtos.KategoriDto
{
    public class KategoriDetayDto
    {
        public int Id { get; set; }
        public string Ad { get; set; }
        public int Sira { get; set; }
        public List<KonuListDto> Konular { get; set; } = new();
    }
}