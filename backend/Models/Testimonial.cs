using System;

namespace backend.Models
{
    public class Testimonial
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string ImagePath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
