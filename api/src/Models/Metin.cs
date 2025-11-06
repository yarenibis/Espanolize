using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Metin
    {
        public int Id { get; set; }
        public string icerik { get; set; }
        public string ceviri { get; set; }

        public string zorluk { get; set; }
        public int MetinTemaId { get; set; }
        public MetinTema MetinTema { get; set; }
    }
}