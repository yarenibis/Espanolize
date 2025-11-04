using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KelimeDto;
using api.src.Interface;
using api.src.Models;

namespace api.src.Repository
{
    public class KelimeRepository : IKelime
    
    {
       ApplicationDbContext _context;
        public KelimeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Kelime> CreateAsync(Kelime tema)
        {
            throw new NotImplementedException();
        }

        public Task<Kelime?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Kelime>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Kelime?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Kelime?> UpdateAsync(int id, KelimeRequest request)
        {
            throw new NotImplementedException();
        }
    }
}