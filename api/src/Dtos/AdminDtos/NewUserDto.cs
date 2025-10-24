using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.src.Dtos.AdminDtos
{
    public class NewUserDto
    {
 
    public string UserName { get; set; }  // Kullanıcının kullanıcı adı
    public string Email { get; set; }     // Kullanıcının e-posta adresi
    public string Token { get; set; }     // JWT (JSON Web Token) — kimlik doğrulama için
    public string Role { get; set; }  

    }
}