using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Sorular
{
    public int Id { get; set; }
    public string Soru { get; set; } // "Metne göre Juan nereye gidiyor?"
    public List<Secenek> Secenekler { get; set; }
    public string DogruCevap { get; set; } // "A"
    public string Aciklama { get; set; } // "Metnin 2. paragrafında..."
    public int OkumaKonuId { get; set; }
    
    public OkumaKonu OkumaKonu { get; set; }
}
}