using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuoteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitQuoteRequest([FromBody] QuoteRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.QuoteRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Quote request submitted successfully", 
                requestDetails = request 
            });
        }

        [HttpGet]
        public IActionResult GetQuotes()
        {
            var quotes = _context.QuoteRequests.ToList();
            return Ok(quotes);
        }
    }
}
