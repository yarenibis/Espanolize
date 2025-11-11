using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos;
using api.src.Dtos.KullanıcıDtos.KelimeDto;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class KelimeTemaMapper
    {
        public static KelimeTemaListDto ToKelimeTemaListDto(this KelimeTemasi tema)
        {
            return new KelimeTemaListDto
            {
                Id = tema.Id,
                Baslik = tema.Baslik,
                Aciklama = tema.Aciklama,
                KapakResmiUrl = tema.Tema?.KapakResmiUrl
            };
        }

        public static KelimeTemaDetayDto ToKelimeTemaDetayDto(this KelimeTemasi tema)
        {
            return new KelimeTemaDetayDto
            {
                Id = tema.Id,
                Baslik = tema.Baslik,
                Aciklama = tema.Aciklama,
                KapakResmiUrl = tema.Tema?.KapakResmiUrl,         // ✅ Detay sayfa kapak resmi
                DetayResimUrls = tema.Tema?.DetayResimler
                    ?.Select(r => r.ResimUrl)
                    .ToList() ?? new List<string>(),
                Kelimeler = tema.Kelimeler?.Select(k => k.ToKelimeListDto())
                  .ToList() ?? new List<KelimeListDto>()
            };
        }
    }
}