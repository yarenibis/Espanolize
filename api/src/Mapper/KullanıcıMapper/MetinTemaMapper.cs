using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.MetinDto;
using api.src.Dtos.KullanıcıDtos.MetinTemaDto;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class MetinTemaMapper
    {
        public static MetinTemaListDto ToMetinTemaListDto(this MetinTema tema)
        {
            return new MetinTemaListDto
            {
                Id = tema.Id,
                Aciklama = tema.Aciklama,
                KapakResmiUrl = tema.Tema?.KapakResmiUrl,
                TemaId=tema.TemaId??0
            };
        }



        public static MetinTemaDetayDto ToMetinTemaDetayDto(this MetinTema tema)
        {
            return new MetinTemaDetayDto
            {
                Id = tema.Id,
                Aciklama = tema.Aciklama,
                KapakResmiUrl = tema.Tema?.KapakResmiUrl,  
                TemaId=tema.TemaId??0,       
                DetayResimUrls = tema.Tema?.DetayResimler
                    ?.Select(r => r.ResimUrl)
                    .ToList() ?? new List<string>(),
                Metinler = tema.Metinler.Select(t => t.ToMetinListDto()).ToList() ?? new List<MetinListDto>()
            };
        }

    }
}