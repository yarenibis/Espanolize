using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos;
using api.src.Models;

namespace api.src.Interface
{
    public interface IMetinTema
    {
        Task<List<MetinTema>> GetAllAsync();
        Task<MetinTema?> GetByIdWithMetinlerAsync(int id);
        Task<MetinTema?> GetByIdAsync(int id);
        Task<MetinTema> CreateAsync(MetinTema tema);
        Task<MetinTema?> UpdateAsync(int id, MetinTemaRequest request);
        Task<MetinTema?> DeleteAsync(int id);
    }
}