using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos.GramerKuralDto
{
    public class GramerKuralRequest
    {
        public string KuralBaslik { get; set; }
    public string Aciklama { get; set; }
    
    // Navigation Properties
    public int KonuId { get; set; }
    }
}