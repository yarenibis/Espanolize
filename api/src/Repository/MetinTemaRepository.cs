using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos;
using api.src.Interface;
using api.src.Mapper.KullanıcıMapper;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class MetinTemaRepository : IMetinTema
    {

        ApplicationDbContext _context;
        public MetinTemaRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<MetinTema> CreateAsync(MetinTema tema)
        {
            await _context.MetinTemalari.AddAsync(tema);
            await _context.SaveChangesAsync();
            return tema;
        }

        public async Task<MetinTema?> DeleteAsync(int id)
        {
            var metinModel=await _context.MetinTemalari.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            _context.Remove(metinModel);
            await _context.SaveChangesAsync();
            return metinModel;
        }

        public async Task<List<MetinTema>> GetAllAsync()
        {
            return await _context.MetinTemalari.ToListAsync();
        }

        public async Task<List<MetinTema>> GetAllWithMetinlerAsync()
        {
            return await _context.MetinTemalari.Include(t => t.Metinler).ToListAsync();
        }

        public async Task<MetinTema?> GetByIdAsync(int id)
        {
            return await _context.MetinTemalari.FindAsync(id);
        }

        public async Task<MetinTema?> GetByIdWithMetinlerAsync(int id)
        {
            return await _context.MetinTemalari
            .Include(t => t.Metinler)
            .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<MetinTema?> UpdateAsync(int id, MetinTemaRequest request)
        {
            var metinModel=await _context.MetinTemalari.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            metinModel.Aciklama = request.Aciklama;
            metinModel.Baslik = request.Baslik;
            await _context.SaveChangesAsync();
            return metinModel;
        }
    }
}