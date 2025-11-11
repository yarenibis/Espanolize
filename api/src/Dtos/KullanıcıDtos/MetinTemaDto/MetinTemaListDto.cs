using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.MetinTemaDto
{
    public class MetinTemaListDto
    {
         public int Id { get; set; }
         public string Baslik{ get; set; }
        public int TemaId{ get; set; }
        public string Aciklama { get; set; }
        public string? KapakResmiUrl { get; set; }
    }
}