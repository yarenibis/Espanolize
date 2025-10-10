using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Secenek
{
    public int Id { get; set; }
    public string Metin { get; set; }
    public int SoruId { get; set; }
    
    public Sorular Soru { get; set; }
}
}