using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text.Json;

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

            // 1. Validate max 10MB size limit for main image
            if (itemDto.Image.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { message = "Maximum file size allowed for the main image is 10MB." });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".svg", ".avif", ".webp" };
            // 2. Validate supported file format for main image
            var mainExtension = GetExtensionFromHeader(itemDto.Image);
            if (!allowedExtensions.Contains(mainExtension.ToLowerInvariant()))
            {
                return BadRequest(new { message = "Unsupported main image format. Allowed formats are JPEG, PNG, SVG, AVIF, and WEBP." });
            }

            // 3. Validate max 12 images in each section/category - Note: the requirement was 12 images per *project*, 
            // but the original code checked per category. Let's keep the category check but change the project check too.
            if (itemDto.AdditionalImages != null && itemDto.AdditionalImages.Count > 11)
            {
                return BadRequest(new { message = "Maximum of 11 additional images allowed per project (12 total)." });
            }

            var countInSection = _context.PortfolioItems.Count(p => p.Category.ToLower() == itemDto.Category.ToLower());
            if (countInSection >= 12)
            {
                // return BadRequest(new { message = $"Maximum of 12 projects allowed in the {itemDto.Category} section." });
                // We'll just continue if they want to add more projects, but the original code blocked it. 
                // Wait, I will keep the original logic for section limit so I don't break existing rules.
                return BadRequest(new { message = $"Maximum of 12 projects allowed in the {itemDto.Category} section." });
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

            var uniqueFileName = Guid.NewGuid().ToString() + mainExtension;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await itemDto.Image.CopyToAsync(stream);
            }
            item.ImagePath = "/uploads/" + uniqueFileName;

            var additionalImagePaths = new List<string>();
            if (itemDto.AdditionalImages != null && itemDto.AdditionalImages.Count > 0)
            {
                foreach (var addImg in itemDto.AdditionalImages)
                {
                    if (addImg.Length > 10 * 1024 * 1024)
                        return BadRequest(new { message = "One of the additional images exceeds the 10MB limit." });
                    
                    var addExt = GetExtensionFromHeader(addImg);
                    if (!allowedExtensions.Contains(addExt.ToLowerInvariant()))
                        return BadRequest(new { message = "One of the additional images has an unsupported format." });

                    var addFileName = Guid.NewGuid().ToString() + addExt;
                    var addFilePath = Path.Combine(uploadsFolder, addFileName);
                    using (var addStream = new FileStream(addFilePath, FileMode.Create))
                    {
                        await addImg.CopyToAsync(addStream);
                    }
                    additionalImagePaths.Add("/uploads/" + addFileName);
                }
            }
            item.AdditionalImages = JsonSerializer.Serialize(additionalImagePaths);

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

            if (!string.IsNullOrEmpty(item.AdditionalImages) && item.AdditionalImages != "[]")
            {
                try
                {
                    var additionalPaths = JsonSerializer.Deserialize<List<string>>(item.AdditionalImages);
                    if (additionalPaths != null)
                    {
                        foreach (var path in additionalPaths)
                        {
                            var addFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path.TrimStart('/'));
                            if (System.IO.File.Exists(addFilePath))
                            {
                                System.IO.File.Delete(addFilePath);
                            }
                        }
                    }
                }
                catch { } // Ignore JSON parsing errors on delete
            }

            _context.PortfolioItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Portfolio item deleted successfully." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePortfolioItem(int id, [FromForm] PortfolioUpdateDto dto)
        {
            var item = await _context.PortfolioItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Portfolio item not found." });

            if (string.IsNullOrEmpty(dto.Title) || string.IsNullOrEmpty(dto.Category))
                return BadRequest(new { message = "Title and Category are required." });

            item.Title = dto.Title;
            item.Location = dto.Location ?? "";
            item.Category = dto.Category;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".svg", ".avif", ".webp" };
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (dto.Image != null)
            {
                if (dto.Image.Length > 10 * 1024 * 1024) return BadRequest(new { message = "Maximum file size for main image is 10MB." });
                var mainExt = GetExtensionFromHeader(dto.Image);
                if (!allowedExtensions.Contains(mainExt.ToLowerInvariant())) return BadRequest(new { message = "Unsupported main image format." });

                // Remove old main image
                if (!string.IsNullOrEmpty(item.ImagePath))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath)) System.IO.File.Delete(oldFilePath);
                }

                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = Guid.NewGuid().ToString() + mainExt;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }
                item.ImagePath = "/uploads/" + uniqueFileName;
            }

            var retainedPaths = new List<string>();
            if (!string.IsNullOrEmpty(dto.RetainedAdditionalImages))
            {
                try
                {
                    retainedPaths = JsonSerializer.Deserialize<List<string>>(dto.RetainedAdditionalImages) ?? new List<string>();
                }
                catch { }
            }

            var currentPaths = new List<string>();
            if (!string.IsNullOrEmpty(item.AdditionalImages) && item.AdditionalImages != "[]")
            {
                try
                {
                    currentPaths = JsonSerializer.Deserialize<List<string>>(item.AdditionalImages) ?? new List<string>();
                }
                catch { }
            }

            // Delete paths that are in currentPaths but NOT in retainedPaths
            foreach(var path in currentPaths)
            {
                if(!retainedPaths.Contains(path))
                {
                    var oldAddFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path.TrimStart('/'));
                    if (System.IO.File.Exists(oldAddFilePath)) System.IO.File.Delete(oldAddFilePath);
                }
            }

            var finalImagePaths = new List<string>(retainedPaths);

            if (dto.AdditionalImages != null && dto.AdditionalImages.Count > 0)
            {
                if (finalImagePaths.Count + dto.AdditionalImages.Count > 11) return BadRequest(new { message = "Maximum of 11 additional images allowed." });
                
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                foreach (var addImg in dto.AdditionalImages)
                {
                    if (addImg.Length > 10 * 1024 * 1024) return BadRequest(new { message = "One of the additional images exceeds 10MB." });
                    var addExt = GetExtensionFromHeader(addImg);
                    if (!allowedExtensions.Contains(addExt.ToLowerInvariant())) return BadRequest(new { message = "Unsupported additional image format." });

                    var addFileName = Guid.NewGuid().ToString() + addExt;
                    var addFilePath = Path.Combine(uploadsFolder, addFileName);
                    using (var addStream = new FileStream(addFilePath, FileMode.Create))
                    {
                        await addImg.CopyToAsync(addStream);
                    }
                    finalImagePaths.Add("/uploads/" + addFileName);
                }
            }
            
            item.AdditionalImages = JsonSerializer.Serialize(finalImagePaths);

            _context.PortfolioItems.Update(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }

    public class PortfolioUpdateDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public string? Category { get; set; }
        public IFormFile? Image { get; set; }
        public List<IFormFile>? AdditionalImages { get; set; }
        public string? RetainedAdditionalImages { get; set; }
    }

    public class PortfolioItemDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public string? Category { get; set; }
        public IFormFile? Image { get; set; }
        public List<IFormFile>? AdditionalImages { get; set; }
    }
}
