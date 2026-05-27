using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AIDesignRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string RoomType { get; set; }

        [Required]
        public string DesignStyle { get; set; }

        public string ColorPreferences { get; set; }

        public string BudgetRange { get; set; }

        public string AdditionalNotes { get; set; }

        public string ImagePath { get; set; }
        
        public string FloorPlanPath { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
