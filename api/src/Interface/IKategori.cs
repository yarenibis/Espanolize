using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Dtos.AdminDtos.KategoriDto;
using api.src.Models;

namespace api.src.Interface
{
    public interface IKategori
    {
        Task<List<Kategori>> GetAllAsync();
        Task<List<Kategori>> GetAllWithKonularAsync();
        Task<Kategori?> GetByIdAsync(int id);
        Task<Kategori> CreateAsync(Kategori kategori);
        Task<Kategori?> UpdateAsync(int id, KategoriRequest request);
        Task<Kategori?> DeleteAsync(int id);
    }
}