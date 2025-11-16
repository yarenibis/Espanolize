using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static  class MetinTemaMapper
    {
        public static MetinTema CreateMetinDto(this MetinTemaRequest request)
        {
            return new MetinTema
            {
                Aciklama = request.Aciklama,
                Baslik = request.Baslik
            };
        }
    }
}