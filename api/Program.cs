using Microsoft.EntityFrameworkCore;
using api.src.Data;
using Microsoft.OpenApi.Models;
using api.src.Interface;
using api.src.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using api.Models;
using api.Interface;
using api.Services;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// -------------------- DB --------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// -------------------- Controllers --------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// -------------------- Swagger --------------------
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });

    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "JWT Authorization header",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// -------------------- Identity --------------------
builder.Services
    .AddIdentity<AppUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredLength = 12;

        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1);
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


// 🔥 IDENTITY COOKIE AYARLARI (ÇAKIŞMAYI BİTİRİR)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;        // ❗ Strict / None YOK
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.Path = "/";

    // API olduğu için redirect YAPMA
    options.Events.OnRedirectToLogin = ctx =>
    {
        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = ctx =>
    {
        ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// -------------------- AUTH (JWT COOKIE) --------------------
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],

        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        ),

        ValidateLifetime = true
    };

    // 🔑 JWT'yi HttpOnly Cookie'den oku
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.TryGetValue("access_token", out var token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

// -------------------- RATE LIMIT --------------------
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("LoginPolicy", context =>
    {
        var ip = context.Connection.RemoteIpAddress?.ToString()
                 ?? context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                 ?? "local";

        return RateLimitPartition.GetFixedWindowLimiter(
            ip,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    });
});

// -------------------- DI --------------------
builder.Services.AddScoped<IKonu, KonuRepository>();
builder.Services.AddScoped<IGramer, GramerRepository>();
builder.Services.AddScoped<IOrnek, OrnekRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IKelime, KelimeRepository>();
builder.Services.AddScoped<IKelimeTema, KelimeTemaRepository>();
builder.Services.AddScoped<IMetinTema, MetinTemaRepository>();
builder.Services.AddScoped<IMetin, MetinRepository>();

// -------------------- CORS --------------------
var corsOrigins = builder.Configuration
    .GetSection("Cors:Origins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(corsOrigins!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // cookie için şart
    });
});

var app = builder.Build();

// -------------------- MIDDLEWARE --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
