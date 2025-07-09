using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Models;

namespace TourBookingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<TripExpense> TripExpenses { get; set; }
        public DbSet<BusExpense> BusExpenses { get; set; }
        public DbSet<FuelEntry> FuelEntries { get; set; }
        public DbSet<OtherExpense> OtherExpenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<TripExpense>()
                .HasOne(te => te.Booking)
                .WithMany()
                .HasForeignKey(te => te.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BusExpense>()
                .HasOne(be => be.TripExpense)
                .WithMany(te => te.BusExpenses)
                .HasForeignKey(be => be.TripExpenseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FuelEntry>()
                .HasOne(fe => fe.BusExpense)
                .WithMany(be => be.FuelEntries)
                .HasForeignKey(fe => fe.BusExpenseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OtherExpense>()
                .HasOne(oe => oe.BusExpense)
                .WithMany(be => be.OtherExpenses)
                .HasForeignKey(oe => oe.BusExpenseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
