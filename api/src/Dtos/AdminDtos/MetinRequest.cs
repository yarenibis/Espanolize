using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos
{
    public class MetinRequest
    {
        public string icerik { get; set; }
        public string ceviri { get; set; }
        public string zorluk { get; set; }
        public int MetinTemaId { get; set; }
    }
}