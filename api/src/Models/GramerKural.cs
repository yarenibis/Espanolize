using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class GramerKural
{
    public int Id { get; set; }
    public string Kural { get; set; } // "Ser fiili kalıcı özellikler için kullanılır"
    public string Aciklama { get; set; } // "Doğum yeri, meslek, karakter özellikleri..."
    public string OrnekCumle { get; set; } // "Yo soy turco."
    public string OrnekCumleTurkce { get; set; } // "Ben Türk'üm."
    public int GramerKonuId { get; set; }
    
    public GramerKonu GramerKonu { get; set; }
}
}