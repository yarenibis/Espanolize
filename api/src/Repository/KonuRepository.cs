using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KonuDto;
using api.src.Interface;
using api.src.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class KonuRepository : IKonu
    {
        ApplicationDbContext _context;
        public  KonuRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Konu> CreateAsync(Konu konu)
        {
            await _context.Konular.AddAsync(konu);
            await _context.SaveChangesAsync();
            return konu;
        }

        public async Task<Konu?> DeleteAsync(int id)
        {
            var konuModel = await _context.Konular.FirstOrDefaultAsync(t => t.Id == id);
            if (konuModel == null)
            {
                return null;
            }
            _context.Konular.Remove(konuModel);
            await _context.SaveChangesAsync();
            return konuModel;
        }

        public async Task<List<Konu>> GetAllAsync()
        {
            return await _context.Konular.ToListAsync();
        }

        public async Task<List<Konu>> GetAllWithKurallarAsync()
        {
            return await _context.Konular
            .Include(k => k.Kurallar)
            .ToListAsync();
        }

        public async Task<Konu?> GetByIdAsync(int id)
        {
            return await _context.Konular.FindAsync(id);
        }

        public async Task<Konu?> UpdateAsync(int id, KonuRequest request)
        {
            var konuModel = await _context.Konular.FirstOrDefaultAsync(t => t.Id == id);
            if (konuModel == null)
            {
                return null;
            }
            konuModel.Aciklama = request.Aciklama;
            konuModel.Baslik = request.Baslik;
            konuModel.CalismaSuresi = request.CalismaSuresi;
            konuModel.KategoriId = request.KategoriId;
            konuModel.Zorluk = request.Zorluk;
            return konuModel;

        }
    }
}