using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KelimeDto;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class KelimeMapper
    {
        public static Kelime CreateKelimeDto( this KelimeRequest request)
        {
            return new Kelime
            {
                Ispanyolca = request.Ispanyolca,
                Turkce = request.Turkce,
                 KelimeTemasiId=request.KelimeTemasiId 

            };
        }
    }
}