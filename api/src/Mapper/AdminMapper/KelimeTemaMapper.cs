using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class KelimeTemaMapper
    {
        public static KelimeTemasi CreateKelimeTemaDto( this KelimeTemaRequest request)
        {
            return new KelimeTemasi
            {
                Baslik = request.Baslik,
                Aciklama = request.Aciklama,
                 TemaId=request.TemaId
            };
        }
    }
}