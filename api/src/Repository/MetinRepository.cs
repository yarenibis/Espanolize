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
            try{
            await _context.Metinler.AddAsync(metin);
            await _context.SaveChangesAsync();
            return metin;
            }catch(Exception ex)
            {
                 throw new Exception("Metin oluşturulurken bir hata oluştu", ex);
            }
        }

        public async Task<Metin?> DeleteAsync(int id)
        {
            try{
            var metinModel=await _context.Metinler.FirstOrDefaultAsync(t => t.Id == id);
            if (metinModel == null)
            {
                return null;
            }
            _context.Remove(metinModel);
            await _context.SaveChangesAsync();
            return metinModel;
            }catch(Exception ex)
            {
                 throw new Exception("Metin silinirken bir hata oluştu", ex);
            }
        }

        public async Task<List<Metin>> GetAllAsync()
        {
            try{
            return await _context.Metinler.ToListAsync();
            }catch(Exception ex)
            {
                 throw new Exception("Metinler getirilirken bir hata oluştu", ex);
            }
        }

        public async Task<Metin?> GetByIdAsync(int id)
        {
            try{
            return await _context.Metinler.FindAsync(id);
            }catch(Exception ex)
            {
                 throw new Exception("Metin getirilirken bir hata oluştu", ex);
            }
        }

        public async Task<Metin?> UpdateAsync(int id, MetinRequest request)
        {
            try{
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
            }catch(Exception ex)
            {
                 throw new Exception("Metin güncellenirken bir hata oluştu", ex);
            }
        }
    }
}