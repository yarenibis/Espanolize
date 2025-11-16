using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos
{
    public class ImageUploadRequest
    {
        public int Category { get; set; } // Kelime / Metin / Gramer
        public int OwnerId { get; set; } // Hangi kaydı temsil ediyor
    }
}