using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PortfolioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPortfolioItems()
        {
            var items = _context.PortfolioItems.OrderByDescending(p => p.CreatedAt).ToList();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddPortfolioItem([FromForm] PortfolioItemDto itemDto)
        {
            if (string.IsNullOrEmpty(itemDto.Title) || string.IsNullOrEmpty(itemDto.Category) || itemDto.Image == null)
            {
                return BadRequest(new { message = "Title, Category and Image are required." });
            }

            // 1. Validate max 10MB size limit
            if (itemDto.Image.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { message = "Maximum file size allowed is 10MB." });
            }

            // 2. Validate supported file format (jpeg, png, svg, avif, webp)
            var extension = GetExtensionFromHeader(itemDto.Image);
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".svg", ".avif", ".webp" };
            if (!allowedExtensions.Contains(extension.ToLowerInvariant()))
            {
                return BadRequest(new { message = "Unsupported image format. Allowed formats are JPEG, PNG, SVG, AVIF, and WEBP." });
            }

            // 3. Validate max 12 images in each section/category
            var countInSection = _context.PortfolioItems.Count(p => p.Category.ToLower() == itemDto.Category.ToLower());
            if (countInSection >= 12)
            {
                return BadRequest(new { message = $"Maximum of 12 images allowed in the {itemDto.Category} section." });
            }

            var item = new PortfolioItem
            {
                Title = itemDto.Title,
                Location = itemDto.Location ?? "",
                Category = itemDto.Category
            };

            // Handle Image Upload
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await itemDto.Image.CopyToAsync(stream);
            }
            item.ImagePath = "/uploads/" + uniqueFileName;

            _context.PortfolioItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        private string GetExtensionFromHeader(IFormFile file)
        {
            try
            {
                using (var stream = file.OpenReadStream())
                {
                    byte[] buffer = new byte[12];
                    int read = stream.Read(buffer, 0, buffer.Length);
                    if (read >= 3 && buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
                    {
                        return ".jpg";
                    }
                    if (read >= 8 && buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47 &&
                        buffer[4] == 0x0D && buffer[5] == 0x0A && buffer[6] == 0x1A && buffer[7] == 0x0A)
                    {
                        return ".png";
                    }
                    if (read >= 4 && buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x38)
                    {
                        return ".gif";
                    }
                    if (read >= 12 && buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
                        buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50)
                    {
                        return ".webp";
                    }
                    if (read >= 12 && buffer[4] == 0x66 && buffer[5] == 0x74 && buffer[6] == 0x79 && buffer[7] == 0x70)
                    {
                        string ftyp = System.Text.Encoding.ASCII.GetString(buffer, 8, 4);
                        if (ftyp == "avif" || ftyp == "avis")
                        {
                            return ".avif";
                        }
                    }
                    if (read >= 5 && (buffer[0] == '<' || (buffer[0] == '?' && buffer[1] == 'x' && buffer[2] == 'm' && buffer[3] == 'l')))
                    {
                        return ".svg";
                    }
                }
            }
            catch
            {
                // Fallback
            }

            return Path.GetExtension(file.FileName).ToLowerInvariant();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePortfolioItem(int id)
        {
            var item = await _context.PortfolioItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Portfolio item not found." });
            }

            // Remove file from disk if it exists
            if (!string.IsNullOrEmpty(item.ImagePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.ImagePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.PortfolioItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Portfolio item deleted successfully." });
        }
    }

    public class PortfolioItemDto
    {
        public string Title { get; set; }
        public string Location { get; set; }
        public string Category { get; set; }
        public IFormFile Image { get; set; }
    }
}
