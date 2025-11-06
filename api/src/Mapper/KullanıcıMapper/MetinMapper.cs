using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.MetinDto;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static  class MetinMapper
    {
        public static MetinListDto ToMetinListDto(this Metin metin)
        {
            return new MetinListDto
            {
                ceviri = metin.ceviri,
                Id = metin.Id,
                icerik = metin.icerik,
                MetinTemaId = metin.MetinTemaId,
                zorluk = metin.zorluk
            };
        }
    }
}