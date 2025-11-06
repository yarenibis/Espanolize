using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Interface;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Metin?> DeleteAsync(int id)
        {
            var metinModel=await _context.Metinler.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            _context.Remove(metinModel);
            await _context.SaveChangesAsync();
            return metinModel;
        }

        public async Task<List<Metin>> GetAllAsync()
        {
            return await _context.Metinler.ToListAsync();
        }

        public async Task<Metin?> GetByIdAsync(int id)
        {
            return await _context.Metinler.FindAsync(id);
        }

        public async Task<Metin?> UpdateAsync(int id, MetinRequest request)
        {
            var metinModel=await _context.Metinler.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            metinModel.ceviri = request.ceviri;
            metinModel.icerik = request.icerik;
            metinModel.zorluk = request.zorluk;
            metinModel.MetinTemaId = request.MetinTemaId;
            await _context.SaveChangesAsync();
            return metinModel;
        }
    }
}