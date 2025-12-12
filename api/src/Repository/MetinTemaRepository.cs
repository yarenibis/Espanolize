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
            try{
            await _context.MetinTemalari.AddAsync(tema);
            await _context.SaveChangesAsync();
            return tema;
            }catch(Exception ex)
            {
                 throw new Exception("Metin tema oluşturulurken bir hata oluştu", ex);
            }
        }

        public async Task<MetinTema?> DeleteAsync(int id)
        {
            try{
            var metinModel = await _context.MetinTemalari.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            _context.Remove(metinModel);
            await _context.SaveChangesAsync();
            return metinModel;
            }catch(Exception ex)
            {
                 throw new Exception("Metin tema silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<MetinTema>> GetAllAsync()
        {
            try{
            return await _context.MetinTemalari.Include(g => g.Tema).ToListAsync();
            }catch(Exception ex)
            {
                 throw new Exception("Beklenmeyen bir hata oluştu. Tekrar deneyiniz.", ex);
            }
        }



        public async Task<MetinTema?> GetByIdAsync(int id)
        {
            try{
            return await _context.MetinTemalari.Include(x => x.Tema).FirstOrDefaultAsync(x => x.Id == id);
            }catch(Exception ex)
            {
                 throw new Exception("Metin tema getirilirken bir hata oluştu", ex);
            }
        }

        public async Task<MetinTema?> GetByIdWithMetinlerAsync(int id)
        {
            try{
            return await _context.MetinTemalari
            .Include(x => x.Tema)
            .ThenInclude(x => x.DetayResimler)
        .Include(x => x.Metinler)
        .FirstOrDefaultAsync(x => x.Id == id);
        }catch(Exception ex)
            {
                 throw new Exception("Beklenmeyen bir hata oluştur. Tekrar deneyiniz.", ex);
            }
        }

        public async Task<MetinTema?> UpdateAsync(int id, MetinTemaRequest request)
        {
            try{
            var metinModel = await _context.MetinTemalari.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            metinModel.Aciklama = request.Aciklama;
            metinModel.TemaId = request.TemaId;
            await _context.SaveChangesAsync();
            return metinModel;
            }catch(Exception ex)
            {
                 throw new Exception("Metin tema güncellenirken bir hata oluştu", ex);
            }
        }
    }
}