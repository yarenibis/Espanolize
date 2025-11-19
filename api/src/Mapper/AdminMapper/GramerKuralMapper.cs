using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Models;

namespace api.src.Mapper.AdminMapper
{
    public static class GramerKuralMapper
    {
        public static GramerKural CreateGramerKuralDto( this GramerKuralRequest request)
        {
            return new GramerKural
            {
                Aciklama = request.Aciklama,
                KonuId = request.KonuId,
                KuralBaslik = request.KuralBaslik
            };
        }
    }
}