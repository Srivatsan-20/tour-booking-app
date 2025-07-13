using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Models;

namespace TourBookingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingBusRent> BookingBusRents { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<BusAllocation> BusAllocations { get; set; }
        public DbSet<BusMaintenanceRecord> BusMaintenanceRecords { get; set; }
        public DbSet<TripExpense> TripExpenses { get; set; }
        public DbSet<BusExpense> BusExpenses { get; set; }
        public DbSet<FuelEntry> FuelEntries { get; set; }
        public DbSet<OtherExpense> OtherExpenses { get; set; }
        public DbSet<User> Users { get; set; }

        // Tour Planner entities
        public DbSet<TouristPlace> TouristPlaces { get; set; }
        public DbSet<PlannedTrip> PlannedTrips { get; set; }
        public DbSet<TripDay> TripDays { get; set; }
        public DbSet<TripStop> TripStops { get; set; }
        public DbSet<TripPlace> TripPlaces { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<BookingBusRent>()
                .HasOne(bbr => bbr.Booking)
                .WithMany(b => b.BusRents)
                .HasForeignKey(bbr => bbr.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Bus allocation relationships
            modelBuilder.Entity<BusAllocation>()
                .HasOne(ba => ba.Bus)
                .WithMany(b => b.BusAllocations)
                .HasForeignKey(ba => ba.BusId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deleting bus if it has allocations

            modelBuilder.Entity<BusAllocation>()
                .HasOne(ba => ba.Booking)
                .WithMany()
                .HasForeignKey(ba => ba.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Bus maintenance relationships
            modelBuilder.Entity<BusMaintenanceRecord>()
                .HasOne(bmr => bmr.Bus)
                .WithMany(b => b.MaintenanceRecords)
                .HasForeignKey(bmr => bmr.BusId)
                .OnDelete(DeleteBehavior.Cascade);

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

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Tour Planner relationships
            modelBuilder.Entity<TripDay>()
                .HasOne(td => td.PlannedTrip)
                .WithMany(pt => pt.TripDays)
                .HasForeignKey(td => td.PlannedTripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripStop>()
                .HasOne(ts => ts.TripDay)
                .WithMany(td => td.TripStops)
                .HasForeignKey(ts => ts.TripDayId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripStop>()
                .HasOne(ts => ts.TouristPlace)
                .WithMany()
                .HasForeignKey(ts => ts.TouristPlaceId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.PlannedTrip)
                .WithMany(pt => pt.TripPlaces)
                .HasForeignKey(tp => tp.PlannedTripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.TouristPlace)
                .WithMany()
                .HasForeignKey(tp => tp.TouristPlaceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
