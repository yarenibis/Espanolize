using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class KelimeTemasi
    {
        public int Id { get; set; }
    public string Baslik { get; set; }
    public string? Aciklama { get; set; }

    public List<Kelime> Kelimeler { get; set; }
    }
}