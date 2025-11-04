using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Kelime
    {
        public int Id { get; set; }
        public string Ispanyolca { get; set; }
        public string Turkce { get; set; }

        public int KelimeTemasiId { get; set; }
        public KelimeTemasi KelimeTemasi { get; set; }
    }


}