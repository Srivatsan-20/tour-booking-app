using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PickupLocation { get; set; } = string.Empty;
        public string DropLocation { get; set; } = string.Empty;
        public int NumberOfPassengers { get; set; }
        public string BusType { get; set; } = string.Empty;
        public int NumberOfBuses { get; set; }
        public string PlacesToCover { get; set; } = string.Empty;
        public string PreferredRoute { get; set; } = string.Empty;
        public string SpecialRequirements { get; set; } = string.Empty;
        public string PaymentMode { get; set; } = string.Empty;
        public string Language { get; set; } = "English";

        // Detailed rent calculation fields
        [Column(TypeName = "decimal(18,2)")]
        public decimal PerDayRent { get; set; } // Rent per bus per day

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MountainRent { get; set; } // Additional mountain rent per bus (nullable)

        [Column(TypeName = "decimal(18,2)")]
        public decimal AdvancePaid { get; set; } // Advance payment received

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalRent { get; set; } // Auto-calculated total rent

        // Rent configuration type
        public bool UseIndividualBusRates { get; set; } = false; // false = same rate for all, true = individual rates

        // Navigation properties
        public virtual ICollection<BookingBusRent> BusRents { get; set; } = new List<BookingBusRent>();

        // Calculated properties
        [NotMapped]
        public int NumberOfDays => (EndDate - StartDate).Days + 1;

        [NotMapped]
        public decimal CalculatedTotalRent =>
            UseIndividualBusRates
                ? CalculateIndividualBusRent()
                : (NumberOfBuses * PerDayRent * NumberOfDays) +
                  (MountainRent.HasValue ? NumberOfBuses * MountainRent.Value : 0);

        private decimal CalculateIndividualBusRent()
        {
            if (BusRents == null || !BusRents.Any())
                return 0;

            return BusRents.Sum(br =>
                (br.PerDayRent * NumberOfDays) +
                (br.MountainRent.HasValue ? br.MountainRent.Value : 0));
        }

        [NotMapped]
        public decimal BalanceToBePaid => TotalRent - AdvancePaid;
    }
}
