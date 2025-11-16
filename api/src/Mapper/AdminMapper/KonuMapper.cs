using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KonuDto;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class KonuMapper
    {
        public static Konu CreateKonuDto(this KonuRequest request)
        {
            return new Konu
            {
                Aciklama = request.Aciklama,
                Baslik = request.Baslik,
                CalismaSuresi = request.CalismaSuresi,
                Zorluk = request.Zorluk,
            };
        }
    }
}