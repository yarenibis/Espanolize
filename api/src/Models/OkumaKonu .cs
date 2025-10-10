using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class OkumaKonu : Konu
{
    public string Metin { get; set; } // İspanyolca okuma metni
    public string MetinTurkce { get; set; } // Türkçe çeviri
    public string SeslendirmeUrl { get; set; } // "metin1.mp3"
    public int OkumaSuresi { get; set; } // 5 (dakika)
    public List<Sorular> Sorular { get; set; }
    public List<Kelime> YeniKelimeler { get; set; }
}
}