using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.OrnekDtos;
using api.src.Models;

namespace api.src.Mapper.KullanıcıMapper
{
    public static class OrnekMapper
    {
        public static OrnekDto ToOrnekDto(this Ornek ornek)
        {
            return new OrnekDto
            {
                Id = ornek.Id,
                IspanyolcaOrnek = ornek.IspanyolcaOrnek,
                Ceviri = ornek.Ceviri,
                Aciklama = ornek.Aciklama
            };
        }
    }
}