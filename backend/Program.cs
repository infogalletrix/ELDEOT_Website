using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowAll");

var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
provider.Mappings[".avif"] = "image/avif";
provider.Mappings[".webp"] = "image/webp";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});

app.UseAuthorization();

// Seed default portfolio items if none exist
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();
        if (!context.PortfolioItems.Any())
        {
            var items = new List<backend.Models.PortfolioItem>
            {
                new backend.Models.PortfolioItem { Title = "Modern Loft Apartment", Location = "New York, NY", Category = "Residential", ImagePath = "/uploads/p2a1.png", CreatedAt = DateTime.UtcNow.AddMinutes(-8) },
                new backend.Models.PortfolioItem { Title = "Luxury Boutique Hotel", Location = "Miami, FL", Category = "Hospitality", ImagePath = "/uploads/p2a2.png", CreatedAt = DateTime.UtcNow.AddMinutes(-7) },
                new backend.Models.PortfolioItem { Title = "Artisan Café", Location = "Austin, TX", Category = "Commercial", ImagePath = "/uploads/p2a3.png", CreatedAt = DateTime.UtcNow.AddMinutes(-6) },
                new backend.Models.PortfolioItem { Title = "The Copper Bean", Location = "Melbourne, Australia", Category = "Commercial", ImagePath = "/uploads/p2b1.png", CreatedAt = DateTime.UtcNow.AddMinutes(-5) },
                new backend.Models.PortfolioItem { Title = "Contemporary Urban Living", Location = "Chicago, IL", Category = "Residential", ImagePath = "/uploads/p2b2.png", CreatedAt = DateTime.UtcNow.AddMinutes(-4) },
                new backend.Models.PortfolioItem { Title = "Nexa Creative Workspace", Location = "London, UK", Category = "Office", ImagePath = "/uploads/p2b3.png", CreatedAt = DateTime.UtcNow.AddMinutes(-3) },
                new backend.Models.PortfolioItem { Title = "Vertex Corporate", Location = "Toronto, Canada", Category = "Office", ImagePath = "/uploads/p2c1.png", CreatedAt = DateTime.UtcNow.AddMinutes(-2) },
                new backend.Models.PortfolioItem { Title = "Nexa Creative Office Room", Location = "New York, NY", Category = "Office", ImagePath = "/uploads/p2c2.png", CreatedAt = DateTime.UtcNow.AddMinutes(-1) }
            };

            context.PortfolioItems.AddRange(items);
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding data: {ex.Message}");
    }
}

app.MapControllers();

app.Run();
