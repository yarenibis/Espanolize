using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class GramerKural
    {
    public int Id { get; set; }
    public string KuralBaslik { get; set; }
    public string Aciklama { get; set; }
    
    // Navigation Properties
    public int KonuId { get; set; }
    public Konu Konu { get; set; }
    
    public List<Ornek> Ornekler { get; set; }
    }
}