using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.GramerDto
{
    public class GramerKuralListDto
    {
         public int Id { get; set; }
        public string KuralBaslik { get; set; }
        public string Aciklama { get; set; }
        public int KonuId { get; set; }
    }
}