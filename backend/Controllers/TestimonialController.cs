using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestimonialController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TestimonialController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetTestimonials()
        {
            var items = _context.Testimonials.OrderByDescending(t => t.CreatedAt).ToList();
            return Ok(items);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddTestimonial([FromForm] IFormFile? image, [FromForm] string name, [FromForm] string role, [FromForm] string text)
        {
            string imagePath = "";

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                imagePath = "/uploads/" + uniqueFileName;
            }

            var testimonial = new Testimonial
            {
                Name = name,
                Role = role,
                Text = text,
                ImagePath = imagePath,
                CreatedAt = DateTime.UtcNow
            };

            _context.Testimonials.Add(testimonial);
            await _context.SaveChangesAsync();

            return Ok(testimonial);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestimonial(int id, [FromForm] IFormFile? image, [FromForm] string name, [FromForm] string role, [FromForm] string text)
        {
            var testimonial = await _context.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            testimonial.Name = name;
            testimonial.Role = role;
            testimonial.Text = text;

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                testimonial.ImagePath = "/uploads/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();
            return Ok(testimonial);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTestimonial(int id)
        {
            var testimonial = await _context.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            _context.Testimonials.Remove(testimonial);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
