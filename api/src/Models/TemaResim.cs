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

     public int OwnerId { get; set; }   
    public int Category { get; set; }
    }
}