using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.OrnekDto;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class OrnekMapper
    {
        public static Ornek CreateKonuDto(this OrnekRequest request)
        {
            return new Ornek
            {
                Aciklama = request.Aciklama,
                Ceviri = request.Ceviri,
                GramerKuralId = request.GramerKuralId,
                IspanyolcaOrnek = request.IspanyolcaOrnek
            };
        }
    }
}