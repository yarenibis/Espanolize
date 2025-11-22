using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class MetinTemaMapper
    {
        public static MetinTema CreateMetinTemaDto(this MetinTemaRequest request)
        {
            return new MetinTema
            {
                TemaId = request.TemaId,
                Aciklama = request.Aciklama
            };
        }
    }
}