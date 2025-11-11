using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Tema
    {
        public int Id { get; set; }
    public string Baslik { get; set; }
    public string? KapakResmiUrl { get; set; }

    public List<TemaResim> DetayResimler { get; set; } = new();
    }
}