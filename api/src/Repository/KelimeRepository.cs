using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Data;
using api.src.Dtos.AdminDtos.KelimeDto;
using api.src.Interface;
using api.src.Models;
using Microsoft.EntityFrameworkCore;

namespace api.src.Repository
{
    public class KelimeRepository : IKelime
    
    {
       ApplicationDbContext _context;
        public KelimeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Kelime> CreateAsync(Kelime kelime)
        {
            try{
            await _context.Kelimeler.AddAsync(kelime);
            await _context.SaveChangesAsync();
            return kelime;
            }catch(Exception ex)
            {
                 throw new Exception("Kelime oluştrulurken bir hata oluştu", ex);
            }
        }

        public async Task<Kelime?> DeleteAsync(int id)
        {
            try{
            var kelimeler=await _context.Kelimeler.FirstOrDefaultAsync(k => k.Id == id);
            if (kelimeler == null)
            {
                return null;
            }
            _context.Remove(kelimeler);
            await _context.SaveChangesAsync();
            return kelimeler;
            }catch(Exception ex)
            {
                 throw new Exception("Kelime silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<Kelime>> GetAllAsync()
        {
            try{
           return  await _context.Kelimeler.ToListAsync();
           }catch(Exception ex)
            {
                 throw new Exception("Kelimeler getirilirken bir hata oluştu", ex);
            }
        }

        public async  Task<Kelime?> GetByIdAsync(int id)
        {
            try{
            return await _context.Kelimeler.FirstOrDefaultAsync(k => k.Id == id);
            }catch(Exception ex)
            {
                 throw new Exception("Kelime bulunurken bir hata oluştu", ex);
            }
        }

        public async Task<Kelime?> UpdateAsync(int id, KelimeRequest request)
        {
            try{
           var kelimeler=await _context.Kelimeler.FirstOrDefaultAsync(k => k.Id == id);
            if (kelimeler == null)
            {
                return null;
            }
            kelimeler.Ispanyolca = request.Ispanyolca;
            kelimeler.Turkce = request.Turkce;
            kelimeler.KelimeTemasiId = request.KelimeTemasiId;
            await _context.SaveChangesAsync();
            return kelimeler;
            }catch(Exception ex)
            {
                 throw new Exception("Kelime güncellenirken bir hata oluştu", ex);
            }
        }
    }
}