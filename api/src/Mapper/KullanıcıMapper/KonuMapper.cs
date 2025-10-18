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
                KategoriId = konu.KategoriId
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
                KategoriId = konu.KategoriId,
                Kurallar = konu.Kurallar?
                    .Select(k => k.ToGramerKuralDto())
                    .ToList() ?? new List<GramerKuralDto>()
            };
        }
    }
}