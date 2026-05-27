using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class QuoteRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string RoomSize { get; set; }

        public string RoomType { get; set; }

        [Required]
        public string MaterialQuality { get; set; }

        [Required]
        public string DesignComplexity { get; set; }

        public string AdditionalNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
