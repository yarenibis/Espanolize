using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Models;

namespace api.src.Interface
{
    public interface IGramer 
    {
         Task<List<GramerKural>> GetAllAsync();
        Task<List<GramerKural>> GetAllWithOrneklerAsync();
        Task<GramerKural?> GetByIdWithOrneklerAsync(int id);
        Task<GramerKural?> GetByIdAsync(int id);
        Task<GramerKural> CreateAsync(GramerKural kural);
        Task<GramerKural?> UpdateAsync(int id, GramerKuralRequest request);
        Task<GramerKural?> DeleteAsync(int id);
    }
}