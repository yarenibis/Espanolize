using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Interface;
using api.src.Models;

namespace api.src.Repository
{
    public class MetinRepository : IMetin
    {
        ApplicationDbContext _context;
        public MetinRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Metin> CreateAsync(Metin metin)
        {
            await _context.Metinler.AddAsync(metin);
            await _context.SaveChangesAsync();
            return metin;
        }

        public Task<Metin?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Metin>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Metin?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Metin?> UpdateAsync(int id, MetinRequest request)
        {
            throw new NotImplementedException();
        }
    }
}