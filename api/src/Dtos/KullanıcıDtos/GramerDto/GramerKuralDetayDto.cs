using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.OrnekDtos;

namespace api.src.Dtos.KullanıcıDtos.GramerDto
{
    public class GramerKuralDto
    {
        public int Id { get; set; }
        public string KuralBaslik { get; set; }
        public string Aciklama { get; set; }
        public List<OrnekDto> Ornekler { get; set; } = new();
    }
}