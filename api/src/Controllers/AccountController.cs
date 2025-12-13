using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Interface;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.src.Dtos.AdminDtos;
using Microsoft.AspNetCore.Authorization;
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

        public AccountController(
            UserManager<AppUser> userManager,
            ITokenService tokenService,
            SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
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

            // Kullanıcının rollerini çek
            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault() ?? "Admin";
            if (userRole != "Admin")
                return Unauthorized("Kullanıcı adı veya şifre hatalı");

            return Ok(new NewUserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
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

            // Test amacıyla Admin rolü veriyoruz
            var roleResult = await _userManager.AddToRoleAsync(appUser, "Admin");

            if (!roleResult.Succeeded)
                return StatusCode(500, roleResult.Errors);

            var userRole = "Admin";

            return Ok(new NewUserDto
            {
                UserName = appUser.UserName,
                Email = appUser.Email,
                Token = await _tokenService.CreateToken(appUser),
                Role = userRole
            });
        }


    }
}
