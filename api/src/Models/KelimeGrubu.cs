using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class KelimeGrubu
{
    public int Id { get; set; }
    public string GrupAdi { get; set; } // Günlük Kelimeler, Seyahat vs.
    public string Aciklama { get; set; }
    public List<Kelime> Kelimeler { get; set; }
}
}