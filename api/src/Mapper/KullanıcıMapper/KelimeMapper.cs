
using api.src.Dtos.KullanıcıDtos.KelimeDto;
using api.src.Models;


namespace api.src.Mapper.KullanıcıMapper
{
    public static class KelimeMapper
    {
        public static KelimeListDto ToKelimeListDto(this Kelime kelime)
        {
            return new KelimeListDto
            {
                Id = kelime.Id,
                Ispanyolca = kelime.Ispanyolca,
                Turkce = kelime.Turkce,
                KelimeTemasiId = kelime.KelimeTemasiId

            };
        }
    }
}