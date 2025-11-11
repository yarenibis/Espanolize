using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class TemaResim
    {
        public int Id { get; set; }
    public string ResimUrl { get; set; }

    public int TemaId { get; set; }
    public Tema Tema { get; set; }
    }
}