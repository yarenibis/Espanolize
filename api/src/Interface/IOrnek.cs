using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.OrnekDto;
using api.src.Models;

namespace api.src.Interface
{
    public interface IOrnek
    {
         Task<List<Ornek>> GetAllAsync();
        Task<Ornek?> GetByIdAsync(int id);
        Task<Ornek> CreateAsync(Ornek ornek);
        Task<Ornek?> UpdateAsync(int id, OrnekRequest request);
        Task<Ornek?> DeleteAsync(int id);
    }
}