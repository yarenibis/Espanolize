using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.KullanıcıDtos.GramerDto;

namespace api.src.Dtos.KullanıcıDtos.KonuDto
{
    public class KonuDetayDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string Zorluk { get; set; }
        public int CalismaSuresi { get; set; }
        public string Aciklama { get; set; }
        public int KategoriId{ get; set; }
        public List<GramerKuralDto> Kurallar { get; set; } = new();
    }
}