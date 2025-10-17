using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KategoriDto;
using api.src.Interface;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class KategoriRepository : IKategori
    {

        private readonly ApplicationDbContext _context;
        public KategoriRepository(ApplicationDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<Kategori> CreateAsync(Kategori kategoriModel)
        {
            await _context.Kategoriler.AddAsync(kategoriModel);
            await _context.SaveChangesAsync();
            return kategoriModel;
        }

        public async Task<Kategori?> DeleteAsync(int id)
        {
            var kategoriModel = await _context.Kategoriler.FirstOrDefaultAsync(t => t.Id == id);
            if (kategoriModel == null)
            {
                return null;
            }
            _context.Kategoriler.Remove(kategoriModel);
            await _context.SaveChangesAsync();
            return kategoriModel;
        }

        public async Task<List<Kategori>> GetAllAsync()
        {
            return await _context.Kategoriler.ToListAsync();
        }

        public async Task<List<Kategori>> GetAllWithKonularAsync()
    {
        return await _context.Kategoriler
            .Include(k => k.Konular)
            .ToListAsync();
    }

        public async Task<Kategori?> GetByIdAsync(int id)
        {
            return await _context.Kategoriler.FindAsync(id);
        }

        public async Task<Kategori?> UpdateAsync(int id, KategoriRequest request)
        {
            var kategoriModel = await _context.Kategoriler.FirstOrDefaultAsync(t => t.Id == id);
            if (kategoriModel == null)
            {
                return null;
            }
            kategoriModel.Ad = request.Ad;
            kategoriModel.Sira = request.Sira;
            await _context.SaveChangesAsync();
            return kategoriModel;
        }
    }
}