using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Kategori
    {
    public int Id { get; set; }
    public string Ad { get; set; }
    public string Icon { get; set; }
    public int Sira { get; set; }
    
    // Navigation Properties
    public List<Konu> Konular { get; set; }
    }
}