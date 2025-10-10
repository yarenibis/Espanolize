using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class KullaniciIlerleme
{
    public int Id { get; set; }
    public string KullaniciId { get; set; } // "user123"
    public int KonuId { get; set; }
    public bool Tamamlandi { get; set; } // true/false
    public DateTime? TamamlanmaTarihi { get; set; }
    public int Puan { get; set; } // 100
    
    public Konu Konu { get; set; }
}
}