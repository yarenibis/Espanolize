using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.KullanıcıDtos.KelimeDto
{
    public class KelimeListDto
    {
        public int Id { get; set; }
        public string Ispanyolca { get; set; }
        public string Turkce { get; set; }

        public int KelimeTemasiId { get; set; }
    }
}