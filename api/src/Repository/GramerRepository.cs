using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.GramerKuralDto;
using api.src.Interface;
using api.src.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class GramerRepository : IGramer
    {
        ApplicationDbContext _context;
        public  GramerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GramerKural> CreateAsync(GramerKural kural)
        {
            await _context.GramerKurallar.AddAsync(kural);
            await _context.SaveChangesAsync();
            return kural;
        }

        public async  Task<GramerKural?> DeleteAsync(int id)
        {
            var kuralModel=await _context.GramerKurallar.FirstOrDefaultAsync(t => t.Id == id);
            if (kuralModel == null)
            {
                return null;
            }
            _context.GramerKurallar.Remove(kuralModel);
            await _context.SaveChangesAsync();
            return kuralModel;
        }

        public async Task<List<GramerKural>> GetAllAsync()
        {
            return await _context.GramerKurallar
        .Include(g => g.Konu)
        .Include(g => g.Ornekler)
        .ToListAsync();
        }

        public async Task<List<GramerKural>> GetAllWithOrneklerAsync()
        {
            return await _context.GramerKurallar.Include(t => t.Ornekler).ToListAsync();
        }

        public async Task<GramerKural?> GetByIdWithOrneklerAsync(int id)
{
    return await _context.GramerKurallar
        .Include(x => x.Ornekler)
        .Include(g => g.Konu)
        .Include(t => t.DetayResimler)
        .FirstOrDefaultAsync(x => x.Id == id);
}


        public async Task<GramerKural?> GetByIdAsync(int id)
        {
            return await _context.GramerKurallar.Include(g => g.Ornekler)

            .Include(t => t.DetayResimler) // ✅ detay fotoğraflar da gelsin
        .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<GramerKural?> UpdateAsync(int id, GramerKuralRequest request)
        {
            var kuralModel = await _context.GramerKurallar.FirstOrDefaultAsync(t => t.Id == id);
            if (kuralModel == null)
            {
                return null;
            }
            kuralModel.Aciklama = request.Aciklama;
            kuralModel.KuralBaslik = request.KuralBaslik;
            kuralModel.KonuId = request.KonuId;
            await _context.SaveChangesAsync();
            return kuralModel;
        }
    }
}