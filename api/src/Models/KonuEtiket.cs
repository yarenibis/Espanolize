using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class KonuEtiket
{
    public int KonuId { get; set; }
    public int EtiketId { get; set; }
    
    public Konu Konu { get; set; }
    public Etiket Etiket { get; set; }
}
}