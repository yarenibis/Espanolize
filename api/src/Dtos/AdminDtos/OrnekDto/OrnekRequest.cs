using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos.OrnekDto
{
    public class OrnekRequest
    {
        public string IspanyolcaOrnek { get; set; }
        public string Ceviri { get; set; }
        public string Aciklama { get; set; }

        // Navigation Properties
        public int GramerKuralId { get; set; }
    }
}