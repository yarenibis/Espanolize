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
        public static GramerKuralDto ToGramerKuralDto(this GramerKural gramer)
        {
            return new GramerKuralDto
            {
                Id = gramer.Id,
                Aciklama = gramer.Aciklama,
                KuralBaslik = gramer.KuralBaslik,
                Ornekler = gramer.Ornekler?
                    .Select(o => o.ToOrnekDto())
                    .ToList() ?? new List<OrnekDto>()

            };
        }
    }
}