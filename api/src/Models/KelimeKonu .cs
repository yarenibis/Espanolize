using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class KelimeKonu : Konu
{
    public string TemaIcon { get; set; } // "food.png"
    public List<Kelime> Kelimeler { get; set; }
}
}