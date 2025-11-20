using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Interface
{
    public interface IKelimeTema
    {
        Task<List<KelimeTemasi>> GetAllAsync();
        Task<KelimeTemasi?> GetAllWithKelimelerAsync(int id);
        Task<KelimeTemasi?> GetByIdAsync(int id);
        Task<KelimeTemasi> CreateAsync(KelimeTemasi tema);
        Task<KelimeTemasi?> UpdateAsync(int id, KelimeTemaRequest request);
        Task<KelimeTemasi?> DeleteAsync(int id);
    }
}