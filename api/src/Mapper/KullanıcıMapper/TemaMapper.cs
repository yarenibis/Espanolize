using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Dtos.KullanıcıDtos.TemaDto;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class TemaMapper
    {
        public static Tema ToTema(this TemaRequest request)
        {
            return new Tema
            {
                Baslik = request.Baslik
            };
        }
        public static TemaListDto ToTemaListDto(this Tema tema)
        {
            return new TemaListDto
            {
                Id = tema.Id,
                Baslik = tema.Baslik,
                KapakResmiUrl = tema.KapakResmiUrl
            };
        }

        public static TemaDetayDto ToTemaDetayDto(this Tema tema)
        {
            return new TemaDetayDto
            {
                Id = tema.Id,
                Baslik = tema.Baslik,
                KapakResmiUrl = tema.KapakResmiUrl,
                DetayResimUrls = tema.DetayResimler?.Select(r => r.ResimUrl).ToList() ?? new List<string>()
            };
        }
    }
}