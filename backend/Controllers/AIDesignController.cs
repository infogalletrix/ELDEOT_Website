using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIDesignController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AIDesignController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitRequest([FromForm] AIDesignRequestDto requestDto)
        {
            if (string.IsNullOrEmpty(requestDto.RoomType) || string.IsNullOrEmpty(requestDto.DesignStyle))
            {
                return BadRequest(new { message = "RoomType and DesignStyle are required." });
            }

            var request = new AIDesignRequest
            {
                RoomType = requestDto.RoomType,
                DesignStyle = requestDto.DesignStyle,
                ColorPreferences = requestDto.ColorPreferences,
                BudgetRange = requestDto.BudgetRange,
                AdditionalNotes = requestDto.AdditionalNotes
            };

            // Handle Image Upload
            if (requestDto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var extension = GetExtensionFromHeader(requestDto.Image);
                var uniqueFileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await requestDto.Image.CopyToAsync(stream);
                }
                request.ImagePath = "/uploads/" + uniqueFileName;
            }

            // Handle Floor Plan Upload
            if (requestDto.FloorPlan != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var extension = GetExtensionFromHeader(requestDto.FloorPlan);
                var uniqueFileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await requestDto.FloorPlan.CopyToAsync(stream);
                }
                request.FloorPlanPath = "/uploads/" + uniqueFileName;
            }

            _context.AIDesignRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "AI Design Request submitted successfully", request });
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

        [HttpGet]
        public IActionResult GetAIDesignRequests()
        {
            var requests = _context.AIDesignRequests.ToList();
            return Ok(requests);
        }
    }

    public class AIDesignRequestDto
    {
        public string RoomType { get; set; }
        public string DesignStyle { get; set; }
        public string ColorPreferences { get; set; }
        public string BudgetRange { get; set; }
        public string AdditionalNotes { get; set; }
        public IFormFile Image { get; set; }
        public IFormFile FloorPlan { get; set; }
    }
}
