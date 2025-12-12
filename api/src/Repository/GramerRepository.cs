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
        public GramerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GramerKural> CreateAsync(GramerKural kural)
        {
            try
            {
                await _context.GramerKurallar.AddAsync(kural);
                await _context.SaveChangesAsync();
                return kural;
            }
            catch (Exception ex)
            {
                throw new Exception("Gramer oluşturulurken bir hata oluştu", ex);
            }
        }

        public async Task<GramerKural?> DeleteAsync(int id)
        {
            try
            {
                var kuralModel = await _context.GramerKurallar.FirstOrDefaultAsync(t => t.Id == id);
                if (kuralModel == null)
                {
                    return null;
                }
                _context.GramerKurallar.Remove(kuralModel);
                await _context.SaveChangesAsync();
                return kuralModel;
            }
            catch (Exception ex)
            {
                throw new Exception("Gramer silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<GramerKural>> GetAllAsync()
        {
            try
            {
                return await _context.GramerKurallar
            .Include(g => g.Konu)
            .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Gramer kuralları getirilirken bir hata oluştu", ex);
            }
        }

        public async Task<List<GramerKural>> GetAllWithOrneklerAsync()
        {
            try{
            return await _context.GramerKurallar.
            Include(g => g.Konu).
            Include(t => t.Ornekler)
            .ToListAsync();
            }catch(Exception ex)
            {
                 throw new Exception("Beklenmeyen bir hata oluştu. Tekrar deneyiniz", ex);
            }
        }
        
        public async Task<GramerKural?> GetByIdWithOrneklerAsync(int id)
        {
            try{
            return await _context.GramerKurallar
            .Include(g => g.Ornekler)
            .FirstOrDefaultAsync(g => g.Id == id);
            }catch(Exception ex)
            {
                 throw new Exception("Gramer kuralı getirilirken bir hata oluştu", ex);
            }
        }


        //admin için
        public async Task<GramerKural?> GetByIdAsync(int id)
        {
            try{

            return await _context.GramerKurallar
         .FirstOrDefaultAsync(g => g.Id == id);
         }catch(Exception ex)
            {
                 throw new Exception("Gramer kuralı bulunurken bir hata oluştu", ex);
            }

        }

        public async Task<GramerKural?> UpdateAsync(int id, GramerKuralRequest request)
        {
            try{
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
            }catch(Exception ex)
            {
                 throw new Exception("Gramer güncellenirken bir hata oluştu", ex);
            }
        }
    }
}