using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class MetinTema
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string Aciklama { get; set; }
        public List<Metin> Metinler { get; set; }
        public int? TemaId { get; set; }
        public Tema Tema { get; set; }
    }
}