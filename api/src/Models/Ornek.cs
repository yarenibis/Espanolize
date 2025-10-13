using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Models
{
    public class Ornek
    {
    public int Id { get; set; }
    public string IspanyolcaOrnek { get; set; }
    public string CeVIRI { get; set; }
    public string Aciklama { get; set; }
    
    // Navigation Properties
    public int? GramerKuralId { get; set; } // Nullable: bazı örnekler kurala bağlı olmayabilir
    public GramerKural GramerKural { get; set; }
    }
}