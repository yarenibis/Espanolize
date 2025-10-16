using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.KonuDto
{
    public class KonuListDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string Zorluk { get; set; }
        public int CalismaSuresi { get; set; }
        public string Aciklama { get; set; }
    }
}