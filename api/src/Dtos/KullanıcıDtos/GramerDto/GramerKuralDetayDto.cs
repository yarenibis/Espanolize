using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.OrnekDtos;

namespace api.src.Dtos.KullanıcıDtos.GramerDto
{
    public class GramerKuralDetayDto
    {
        public int Id { get; set; }
        public string KuralBaslik { get; set; }
        public string Aciklama { get; set; }
        public int KonuId { get; set; }
        public List<OrnekListDto> Ornekler { get; set; } = new();
        public int TemaId{ get; set; }
        public string? KapakResmiUrl { get; set; }   // ✅ Ekledik
    public List<string> DetayResimUrls { get; set; } = new(); 
        
    }
}