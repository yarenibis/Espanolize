using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using api.Interface;
using api.Models;
using api.src.Dtos.AdminDtos;

namespace api.src.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IWebHostEnvironment _env;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IWebHostEnvironment env)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _env = env;
        }

        // 🔹 Ortak Cookie Ayarı (TEK KAYNAK)
        private CookieOptions AccessTokenCookieOptions(DateTimeOffset? expires = null)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = _env.IsProduction(), // localhost:false, prod:true
                SameSite = SameSiteMode.Lax, // frontend farklı origin
                Path = "/",
                Expires = expires
            };
        }

        // ========================= LOGIN =========================
        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.UserName == loginDto.UserName.ToLower());

            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre hatalı");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                lockoutOnFailure: true);

            if (!result.Succeeded)
                return Unauthorized("Kullanıcı adı veya şifre hatalı");

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Admin"))
                return Unauthorized("Yetkisiz kullanıcı");

            var token = await _tokenService.CreateToken(user);

            Response.Cookies.Append(
                "access_token",
                token,
                AccessTokenCookieOptions(DateTimeOffset.UtcNow.AddHours(1))
            );

            return Ok(new
            {
                user.UserName,
                user.Email,
                Role = "Admin"
            });
        }

        // ========================= REGISTER =========================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new AppUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return StatusCode(500, result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Admin");
            if (!roleResult.Succeeded)
                return StatusCode(500, roleResult.Errors);

            var token = await _tokenService.CreateToken(user);

            Response.Cookies.Append(
                "access_token",
                token,
                AccessTokenCookieOptions(DateTimeOffset.UtcNow.AddHours(1))
            );

            return Ok(new
            {
                user.UserName,
                user.Email,
                Role = "Admin"
            });
        }

        // ========================= LOGOUT =========================
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // 🔑 Identity context temizle
            await _signInManager.SignOutAsync();

            // 🔥 Cookie'yi %100 silecek yöntem
            Response.Cookies.Append(
                "access_token",
                "",
                AccessTokenCookieOptions(DateTimeOffset.UtcNow.AddDays(-1))
            );

            return Ok();
        }

        // ========================= ME =========================
        [Authorize(Roles = "Admin")]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userName = User.Identity?.Name;
            if (string.IsNullOrEmpty(userName))
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                userName = user.UserName,
                email = user.Email,
                role = roles.FirstOrDefault()
            });
        }
    }
}
