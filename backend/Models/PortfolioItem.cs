using System;

namespace backend.Models
{
    public class PortfolioItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Category { get; set; }
        public string ImagePath { get; set; }
        public string AdditionalImages { get; set; } = "[]";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
