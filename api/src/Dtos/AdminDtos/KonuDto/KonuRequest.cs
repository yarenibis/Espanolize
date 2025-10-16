using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos.KonuDto
{
    public class KonuRequest
    {
        public int Id { get; set; }
    public string Baslik { get; set; }
    public string Zorluk { get; set; } // "Kolay", "Orta", "Zor"
    public int CalismaSuresi { get; set; } // Dakika cinsinden
    public string Aciklama { get; set; }
    
    // Navigation Properties
    public int KategoriId { get; set; }
    }
}