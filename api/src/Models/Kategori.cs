using api.src.Models;

namespace Models
{
    public class Kategori
{
    public int Id { get; set; }
    public string Ad { get; set; } // "Gramer", "Kelime", "Okuma"
    public string Aciklama { get; set; } // "İspanyolca gramer konuları"
    public string Icon { get; set; } // "grammar-icon.png"
    public int Sira { get; set; } // 1, 2, 3 (görüntülenme sırası)
    public bool Aktif { get; set; }
    
    public List<Konu> Konular { get; set; }
}
}