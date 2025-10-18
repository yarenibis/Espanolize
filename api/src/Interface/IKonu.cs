using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KonuDto;
using api.src.Models;

namespace api.src.Interface
{
    public interface IKonu
    {
         Task<List<Konu>> GetAllAsync();
        Task<List<Konu>> GetAllWithKurallarAsync();
        Task<Konu?> GetByIdAsync(int id);
        Task<Konu> CreateAsync(Konu konu);
        Task<Konu?> UpdateAsync(int id, KonuRequest request);
        Task<Konu?> DeleteAsync(int id);
    }
}