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
            try{
            await _context.Ornekler.AddAsync(ornek);
            await _context.SaveChangesAsync();
            return ornek;
            }
            catch (Exception ex) {
               throw new Exception("Ornek kaydedilirken bir hata oluştu", ex);
            }
        }

        public async Task<Ornek?> DeleteAsync(int id)
        {
            try{
            var ornekModel = await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
            if (ornekModel == null)
            {
                return null;
            }
            _context.Ornekler.Remove(ornekModel);
            await _context.SaveChangesAsync();
            return ornekModel;
            }catch(Exception ex)
            {
                 throw new Exception("Ornek silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<Ornek>> GetAllAsync()
        {
            try{
            return await _context.Ornekler.ToListAsync();
            }catch(Exception ex)
            {
                 throw new Exception("Beklenmeyen bir hata oluştu. Tekrar deneyiniz.", ex);
            }
        }

        public async Task<Ornek?> GetByIdAsync(int id)
        {  
            try{
            return await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
            }catch(Exception ex)
            {
                 throw new Exception("Ornek getirilirken bir hata oluştu", ex);
            }
        }

        public async Task<Ornek?> UpdateAsync(int id, OrnekRequest request)
        {
            try{
            var ornekModel = await _context.Ornekler.FirstOrDefaultAsync(t => t.Id == id);
            if (ornekModel == null)
            {
                return null;
            }
            ornekModel.Aciklama = request.Aciklama;
            ornekModel.IspanyolcaOrnek = request.IspanyolcaOrnek;
            ornekModel.Ceviri = request.Ceviri;
            ornekModel.GramerKuralId = request.GramerKuralId;
            await _context.SaveChangesAsync();
            return ornekModel;
            }catch(Exception ex)
            {
                 throw new Exception("Ornek güncellenirken bir hata oluştu", ex);
            }
        }
    }
}