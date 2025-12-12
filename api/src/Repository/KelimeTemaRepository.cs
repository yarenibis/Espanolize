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
    public class KelimeTemaRepository : IKelimeTema
    {
        ApplicationDbContext _context;
        public KelimeTemaRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<KelimeTemasi> CreateAsync(KelimeTemasi tema)
        {
            try
            {
                await _context.KelimeTemalari.AddAsync(tema);
                await _context.SaveChangesAsync();
                return tema;
            }
            catch (Exception ex)
            {
                throw new Exception("Kelime tema oluşturulurken bir hata oluştu", ex);
            }
        }

        public async Task<KelimeTemasi?> DeleteAsync(int id)
        {
            try
            {
                var temaModel = await _context.KelimeTemalari.FirstOrDefaultAsync(k => k.Id == id);
                if (temaModel == null)
                {
                    return null;
                }
                _context.Remove(temaModel);
                await _context.SaveChangesAsync();
                return temaModel;
            }
            catch (Exception ex)
            {
                throw new Exception("Kelime tema silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<KelimeTemasi>> GetAllAsync()
        {
            try
            {
                return await _context.KelimeTemalari.Include(g => g.Tema).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Beklenmeyen bir hata oluştu. Tekrar deneyiniz.", ex);
            }
        }



        public async Task<KelimeTemasi?> GetAllWithKelimelerAsync(int id)
        {
            try
            {
                return await _context.KelimeTemalari
                .Include(x => x.Tema)
                .ThenInclude(x => x.DetayResimler)
            .Include(x => x.Kelimeler)
            .FirstOrDefaultAsync(x => x.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Beklenmeyen bir hata oluştu. Tekrar deneyiniz", ex);
            }
        }

        public async Task<KelimeTemasi?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.KelimeTemalari.Include(t => t.Tema)
           .FirstOrDefaultAsync(t => t.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Kelime tema bulunurken bir hata oluştu", ex);
            }
        }



        public async Task<KelimeTemasi?> UpdateAsync(int id, KelimeTemaRequest request)
        {
            try{
            var temaModel = await _context.KelimeTemalari.FirstOrDefaultAsync(k => k.Id == id);
            if (temaModel == null)
            {
                return null;
            }
            temaModel.Aciklama = request.Aciklama;
            temaModel.TemaId = request.TemaId;
            await _context.SaveChangesAsync();
            return temaModel;
            }catch(Exception ex)
            {
                 throw new Exception("Kelime tema güncellenirken bir hata oluştu", ex);
            }
        }
    }
}