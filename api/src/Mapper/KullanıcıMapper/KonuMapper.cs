using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.GramerDto;
using api.src.Dtos.KullanıcıDtos.KonuDto;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class KonuMapper
    {
        public static KonuListDto ToKonuListDto(this Konu konu)
        {
            return new KonuListDto
            {
                Id = konu.Id,
                Baslik = konu.Baslik,
                Aciklama = konu.Aciklama,
                CalismaSuresi = konu.CalismaSuresi,
                Zorluk = konu.Zorluk,
                TemaId=konu.TemaId??0,
                KapakResmiUrl = konu.Tema?.KapakResmiUrl
            };
        }

        public static KonuDetayDto ToKonuDetayDto(this Konu konu)
        {
            return new KonuDetayDto
            {
                Id = konu.Id,
                Baslik = konu.Baslik,
                Aciklama = konu.Aciklama,
                CalismaSuresi = konu.CalismaSuresi,
                Zorluk = konu.Zorluk,
                TemaId=konu.TemaId??0,
                KapakResmiUrl = konu.Tema?.KapakResmiUrl,         // ✅ Detay sayfa kapak resmi
                DetayResimUrls = konu.Tema?.DetayResimler
                    ?.Select(r => r.ResimUrl)
                    .ToList() ?? new List<string>(),
                Kurallar = konu.Kurallar?
                    .Select(k => k.ToGramerKuralListDto())
                    .ToList() ?? new List<GramerKuralListDto>()
            };
        }
    }
}