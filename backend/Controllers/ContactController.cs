using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetContacts()
        {
            var contacts = _context.Contacts.ToList();

            return Ok(contacts);
        }

        [HttpPost]
        public IActionResult AddContact(Contact contact)
        {
            _context.Contacts.Add(contact);

            _context.SaveChanges();

            return Ok(contact);
        }
    }
}