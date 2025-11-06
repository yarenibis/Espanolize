using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Interface
{
    public interface IMetin
    {
        Task<List<Metin>> GetAllAsync();

        Task<Metin?> GetByIdAsync(int id);
        Task<Metin> CreateAsync(Metin metin);
        Task<Metin?> UpdateAsync(int id, MetinRequest request);
        Task<Metin?> DeleteAsync(int id);
    }
}