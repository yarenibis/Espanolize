using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KelimeDto;
using api.src.Models;

namespace api.src.Interface
{
    public interface IKelime
    {
        Task<List<Kelime>> GetAllAsync();

        Task<Kelime?> GetByIdAsync(int id);
        Task<Kelime> CreateAsync(Kelime kelime);
        Task<Kelime?> UpdateAsync(int id, KelimeRequest request);
        Task<Kelime?> DeleteAsync(int id);
    }
}