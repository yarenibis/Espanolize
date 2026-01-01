using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos
{
    public class UploadDetailsRequest
    {
        public List<IFormFile> Files { get; set; }
    }
}