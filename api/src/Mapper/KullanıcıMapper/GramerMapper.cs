using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.GramerDto;
using api.src.Dtos.KullanıcıDtos.OrnekDtos;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class GramerMapper
    {
        public static GramerKuralListDto ToGramerKuralListDto(this GramerKural gramer)
        {
            return new GramerKuralListDto
            {
                Id = gramer.Id,
                Aciklama = gramer.Aciklama,
                KuralBaslik = gramer.KuralBaslik,
                KonuId = gramer.KonuId,
                KapakResmiUrl = gramer.Tema?.KapakResmiUrl

            };
        }


        public static GramerKuralDetayDto ToGramerKuralDetayDto(this GramerKural gramer)
        {
            return new GramerKuralDetayDto
            {
                Id = gramer.Id,
                Aciklama = gramer.Aciklama,
                KuralBaslik = gramer.KuralBaslik,
                KonuId = gramer.KonuId,
                KapakResmiUrl = gramer.Tema?.KapakResmiUrl,         // ✅ Detay sayfa kapak resmi
                DetayResimUrls = gramer.Tema?.DetayResimler
                    ?.Select(r => r.ResimUrl)
                    .ToList() ?? new List<string>(),
                Ornekler = gramer.Ornekler?
                    .Select(o => o.ToOrnekListDto())
                    .ToList() ?? new List<OrnekListDto>()

            };
        }
    }
}