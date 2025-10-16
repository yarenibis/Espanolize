using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos;
using api.src.Dtos.KullanıcıDtos.KategoriDto;
using api.src.Dtos.KullanıcıDtos.KonuDto;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;

namespace api.src.Mapper
{
    public static class KategoriMapper
    {
        public static KategoriListDto ToKategoriListDto(this Kategori kategori)
        {
            return new KategoriListDto
            {
                Id = kategori.Id,
                Ad = kategori.Ad,
                Sira = kategori.Sira,
            };
        }

        public static KategoriDetayDto ToKategoriDetayDto(this Kategori kategori)
        {
            return new KategoriDetayDto
            {
                Id = kategori.Id,
                Ad = kategori.Ad,
                Sira = kategori.Sira,
                Konular = kategori.Konular?.Select(k => k.ToKonuListDto())
                    .ToList() ?? new List<KonuListDto>()
            };
        }
    }
}