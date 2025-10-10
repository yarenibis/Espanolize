using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Ornek
{
    public int Id { get; set; }
    public string Ispanyolca { get; set; }
    public string Turkce { get; set; }
    public string Aciklama { get; set; }
    public int KonuId { get; set; }
    
    public Konu Konu { get; set; }
}
}