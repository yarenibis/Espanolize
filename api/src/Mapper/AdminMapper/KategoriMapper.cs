using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KategoriDto;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static  class KategoriMapper
    {
        public static Kategori CreateKategoriDto( this KategoriRequest request)
        {
            return new Kategori
            {
                Ad = request.Ad,
                Sira = request.Sira
            };
        }
    }
}