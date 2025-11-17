using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.TemaDto
{
    public class TemaDetayDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }

        public string? KapakResmiUrl { get; set; }

        // Çoklu detay resimleri
        public List<string> DetayResimUrls { get; set; } = new();
    }
}