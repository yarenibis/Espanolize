using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Etiket
{
    public int Id { get; set; }
    public string Ad { get; set; }
    public string Renk { get; set; }
    
    public List<KonuEtiket> KonuEtiketler { get; set; }
}
}