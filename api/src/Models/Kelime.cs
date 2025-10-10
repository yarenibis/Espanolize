using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Kelime
{
    public int Id { get; set; }
    public string Ispanyolca { get; set; } // "casa"
    public string Turkce { get; set; } // "ev"
    public string Okunus { get; set; } // "kasa"
    public string KelimeTuru { get; set; } // "İsim", "Fiil", "Sıfat"
    public string Cinsiyet { get; set; } // "Masculino", "Femenino"
    public string OrnekCumle { get; set; } // "Mi casa es bonita."
    public string OrnekCumleTurkce { get; set; } // "Benim evim güzel."
    public string ResimUrl { get; set; } // "casa.jpg"
    public string SesUrl { get; set; } // "casa.mp3"
    public int KelimeKonuId { get; set; }
    
    public KelimeKonu KelimeKonu { get; set; }
}
}