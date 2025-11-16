using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.MetinDto;

namespace api.src.Dtos.KullanıcıDtos.MetinTemaDto
{
    public  class MetinTemaDetayDto
    {
         public int Id { get; set; }
        public string Baslik { get; set; }
        public string Aciklama { get; set; }

        public List<MetinListDto> Metinler { get; set; } = new();
        public string? KapakResmiUrl { get; set; }   // ✅ Ekledik
    public List<string> DetayResimUrls { get; set; } = new(); 
    }
}