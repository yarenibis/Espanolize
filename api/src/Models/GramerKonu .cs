using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class GramerKonu : Konu
{
    public string KullanimAlani { get; set; } // "Yazma, Konuşma, Resmi"
    public string ZorlukDerecesi { get; set; } // "Kolay", "Orta", "Zor"
    public List<GramerKural> Kurallar { get; set; }
}
}