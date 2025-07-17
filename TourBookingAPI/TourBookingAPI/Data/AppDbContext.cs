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

        // Public Booking entities
        public DbSet<CustomerAccount> CustomerAccounts { get; set; }
        public DbSet<PublicBooking> PublicBookings { get; set; }
        public DbSet<CustomerPayment> CustomerPayments { get; set; }
        public DbSet<CustomerReview> CustomerReviews { get; set; }
        public DbSet<BusPhoto> BusPhotos { get; set; }
        public DbSet<BusAmenity> BusAmenities { get; set; }
        public DbSet<BusAmenityMapping> BusAmenityMappings { get; set; }

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

            // Public Booking relationships
            modelBuilder.Entity<PublicBooking>()
                .HasOne(pb => pb.CustomerAccount)
                .WithMany(ca => ca.Bookings)
                .HasForeignKey(pb => pb.CustomerAccountId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PublicBooking>()
                .HasOne(pb => pb.Bus)
                .WithMany()
                .HasForeignKey(pb => pb.BusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomerPayment>()
                .HasOne(cp => cp.Booking)
                .WithMany(pb => pb.Payments)
                .HasForeignKey(cp => cp.PublicBookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CustomerReview>()
                .HasOne(cr => cr.Booking)
                .WithMany()
                .HasForeignKey(cr => cr.PublicBookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CustomerReview>()
                .HasOne(cr => cr.CustomerAccount)
                .WithMany(ca => ca.Reviews)
                .HasForeignKey(cr => cr.CustomerAccountId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CustomerReview>()
                .HasOne(cr => cr.Bus)
                .WithMany()
                .HasForeignKey(cr => cr.BusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BusPhoto>()
                .HasOne(bp => bp.Bus)
                .WithMany()
                .HasForeignKey(bp => bp.BusId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BusAmenityMapping>()
                .HasOne(bam => bam.Bus)
                .WithMany()
                .HasForeignKey(bam => bam.BusId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BusAmenityMapping>()
                .HasOne(bam => bam.BusAmenity)
                .WithMany(ba => ba.BusAmenityMappings)
                .HasForeignKey(bam => bam.BusAmenityId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraints
            modelBuilder.Entity<CustomerAccount>()
                .HasIndex(ca => ca.Email)
                .IsUnique();

            modelBuilder.Entity<PublicBooking>()
                .HasIndex(pb => pb.BookingNumber)
                .IsUnique();
        }
    }
}
