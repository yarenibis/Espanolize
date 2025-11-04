using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.KelimeDto;
using api.src.Models;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class KelimeMapper
    {
        public static KelimeListDto ToKelimeListDto(this Kelime kelime)
        {
            return new KelimeListDto
            {
                Id = kelime.Id,
                Ispanyolca = kelime.Ispanyolca,
                Turkce = kelime.Turkce,
                KelimeTemasiId = kelime.KelimeTemasiId

            };
        }
    }
}