using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.src.Dtos.AdminDtos;
using Microsoft.AspNetCore.RateLimiting;

namespace api.src.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IWebHostEnvironment _env;

        public AccountController(
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            SignInManager<AppUser> signInManager,
            IWebHostEnvironment env)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _env = env;
        }

        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<IActionResult> Login(LoginDto loginDto)
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
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
                return Unauthorized("Kullanıcı adı veya şifre hatalı");

            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault();

            if (userRole != "Admin")
                return Unauthorized("Kullanıcı adı veya şifre hatalı");

            var token = await _tokenService.CreateToken(user);

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = _env.IsProduction(), // PROD'da true
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });

            return Ok(new
            {
                user.UserName,
                user.Email,
                Role = userRole
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appUser = new AppUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };

            var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

            if (!createdUser.Succeeded)
                return StatusCode(500, createdUser.Errors);

            var roleResult = await _userManager.AddToRoleAsync(appUser, "Admin");

            if (!roleResult.Succeeded)
                return StatusCode(500, roleResult.Errors);

            var token = await _tokenService.CreateToken(appUser);

            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = _env.IsProduction(),
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });

            return Ok(new
            {
                appUser.UserName,
                appUser.Email,
                Role = "Admin"
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            return Ok();
        }
    }
}
