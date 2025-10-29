using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.OrnekDtos
{
    public class OrnekListDto
    {
         public int Id { get; set; }
        public string IspanyolcaOrnek { get; set; }
        public string Ceviri { get; set; }
        public string Aciklama { get; set; }
        public int GramerKuralId{ get; set; }
    }
}