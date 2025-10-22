using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.OrnekDto;
using api.src.Interface;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class OrnekRepository : IOrnek
    {
        ApplicationDbContext _context;
        public OrnekRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Ornek> CreateAsync(Ornek ornek)
        {
            await _context.Ornekler.AddAsync(ornek);
            await _context.SaveChangesAsync();
            return ornek;

        }

        public async Task<Ornek?> DeleteAsync(int id)
        {
            var ornekModel = await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
            if (ornekModel == null)
            {
                return null;
            }
            _context.Ornekler.Remove(ornekModel);
            await _context.SaveChangesAsync();
            return ornekModel;
        }

        public async Task<List<Ornek>> GetAllAsync()
        {
            return await _context.Ornekler.ToListAsync();
        }

        public async Task<Ornek?> GetByIdAsync(int id)
        {
            return await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Ornek?> UpdateAsync(int id, OrnekRequest request)
        {
            var ornekModel = await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
            if (ornekModel == null)
            {
                return null;
            }
            ornekModel.Aciklama = request.Aciklama;
            ornekModel.IspanyolcaOrnek = request.IspanyolcaOrnek;
            ornekModel.Ceviri = request.Ceviri;
            ornekModel.GramerKuralId = request.GramerKuralId;
            return ornekModel;
        }
    }
}