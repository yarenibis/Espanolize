using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static  class MetinMapper
    {
        public static Metin CreateMetin(this MetinRequest request)
        {
            return new Metin
            {
                ceviri = request.ceviri,
                icerik = request.icerik,
                MetinTemaId = request.MetinTemaId,
                zorluk = request.zorluk
            };
        }
    }
}