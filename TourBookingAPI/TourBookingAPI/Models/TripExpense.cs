using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class TripExpense
    {
        public int Id { get; set; }

        [Required]
        public int BookingId { get; set; }

        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;

        // Navigation properties - now we track expenses per bus
        public virtual ICollection<BusExpense> BusExpenses { get; set; } = new List<BusExpense>();

        // Calculated properties - now aggregate from all buses
        [NotMapped]
        public decimal TotalFuelCost => BusExpenses?.Sum(be => be.TotalFuelCost) ?? 0;

        [NotMapped]
        public decimal TotalOtherExpenses => BusExpenses?.Sum(be => be.TotalOtherExpenses) ?? 0;

        [NotMapped]
        public decimal TotalDriverBatta => BusExpenses?.Sum(be => be.DriverBatta) ?? 0;

        [NotMapped]
        public decimal TotalExpenses => BusExpenses?.Sum(be => be.TotalBusExpenses) ?? 0;

        [NotMapped]
        public decimal ProfitOrLoss => (Booking?.TotalRent ?? 0) - TotalExpenses;

        [NotMapped]
        public int TotalBuses => BusExpenses?.Count ?? 0;
    }
}
