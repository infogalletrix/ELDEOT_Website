using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<AIDesignRequest> AIDesignRequests { get; set; }
        public DbSet<QuoteRequest> QuoteRequests { get; set; }
        public DbSet<PortfolioItem> PortfolioItems { get; set; }
    }
}