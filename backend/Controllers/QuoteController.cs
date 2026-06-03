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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuote(int id, [FromBody] QuoteRequest updatedQuote)
        {
            if (id != updatedQuote.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedQuote).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuote(int id)
        {
            var quote = await _context.QuoteRequests.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            _context.QuoteRequests.Remove(quote);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
