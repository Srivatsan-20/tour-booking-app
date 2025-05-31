using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Models;

namespace TourBookingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
    }
}
