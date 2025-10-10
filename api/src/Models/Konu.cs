using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;

namespace api.src.Models
{
    public class Konu
{
    public int Id { get; set; }
    public string Baslik { get; set; } // "Ser ve Estar Farkı"
    public string Icerik { get; set; } // "Ser ve estar fiilleri..."
    public string Ozet { get; set; } // "İspanyolcada iki 'olmak' fiili..."
    public DateTime OlusturmaTarihi { get; set; }
    public DateTime? GuncellemeTarihi { get; set; }
    public int Goruntulenme { get; set; } // 150
    public int Begeni { get; set; } // 25
    public int Seviye { get; set; } // 1:Başlangıç, 2:Orta, 3:İleri
    public bool Aktif { get; set; }
    
    public int KategoriId { get; set; }
    public int? UstKonuId { get; set; }
    
    public Kategori Kategori { get; set; }
    public Konu UstKonu { get; set; }
    public List<Konu> AltKonular { get; set; }
    public List<Ornek> Ornekler { get; set; }
    public List<KonuEtiket> KonuEtiketler { get; set; }
}
}