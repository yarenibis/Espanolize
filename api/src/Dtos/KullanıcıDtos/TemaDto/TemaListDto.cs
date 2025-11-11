using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.TemaDto
{
    public class TemaListDto
    {
        public int Id { get; set; }
        public string Baslik { get; set; }

        // Tema sadece görsel sunum olduğu için
        public string? KapakResmiUrl { get; set; }
    }
}