using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using api.Models;

namespace api.src.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Kategori> Kategoriler { get; set; }
        public DbSet<Konu> Konular { get; set; }
        public DbSet<GramerKural> GramerKurallar { get; set; }
        public DbSet<Ornek> Ornekler { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Sadece ilişkileri belirtmek yeterli
            modelBuilder.Entity<Kategori>()
                .HasMany(k => k.Konular)
                .WithOne(k => k.Kategori)
                .HasForeignKey(k => k.KategoriId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Konu>()
                .HasMany(k => k.Kurallar)
                .WithOne(g => g.Konu)
                .HasForeignKey(g => g.KonuId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GramerKural>()
                .HasMany(g => g.Ornekler)
                .WithOne(o => o.GramerKural)
                .HasForeignKey(o => o.GramerKuralId)
                .OnDelete(DeleteBehavior.Cascade);


            var adminRole = new IdentityRole
            {
                Id = "Admin",
                Name = "Admin",
                NormalizedName = "ADMIN"
            };
            modelBuilder.Entity<IdentityRole>().HasData(adminRole);

        }


    }
}