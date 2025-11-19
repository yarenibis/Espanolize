using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.src.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using api.Models;
using System.Text.Json;

namespace api.src.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }
        public ApplicationDbContext()
    {
    }

        public DbSet<Konu> Konular { get; set; }
        public DbSet<GramerKural> GramerKurallar { get; set; }
        public DbSet<Ornek> Ornekler { get; set; }
        public DbSet<KelimeTemasi> KelimeTemalari { get; set; }
        public DbSet<Kelime> Kelimeler { get; set; }
        public DbSet<MetinTema> MetinTemalari { get; set; }

        public DbSet<Metin> Metinler { get; set; }
        public DbSet<TemaResim> TemaResimleri { get; set; }
        public DbSet<Tema> Temalar { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<KelimeTemasi>()
                .HasMany(k => k.Kelimeler)
                .WithOne(k => k.KelimeTemasi)
                .HasForeignKey(k => k.KelimeTemasiId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MetinTema>()
                .HasMany(k => k.Metinler)
                .WithOne(k => k.MetinTema)
                .HasForeignKey(k => k.MetinTemaId)
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

            modelBuilder.Entity<Tema>()
                .HasMany(t => t.DetayResimler)
                .WithOne(r => r.Tema)
                .HasForeignKey(r => r.TemaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Konu>()
               .HasOne(g => g.Tema)
            .WithMany()
            .HasForeignKey(g => g.TemaId)
 .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<KelimeTemasi>()
            .HasOne(k => k.Tema)
            .WithMany()
            .HasForeignKey(k => k.TemaId)
            .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<MetinTema>()
            .HasOne(m => m.Tema)
            .WithMany()
            .HasForeignKey(m => m.TemaId)
            .OnDelete(DeleteBehavior.SetNull);


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