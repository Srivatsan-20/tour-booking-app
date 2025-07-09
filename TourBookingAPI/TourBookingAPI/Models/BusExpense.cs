using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class BusExpense
    {
        public int Id { get; set; }

        [Required]
        public int TripExpenseId { get; set; }

        [ForeignKey("TripExpenseId")]
        public virtual TripExpense TripExpense { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string BusNumber { get; set; } = string.Empty; // e.g., "Bus 1", "Bus 2", or actual bus registration number

        [Column(TypeName = "decimal(18,2)")]
        public decimal DriverBatta { get; set; } // Driver batta for this specific bus

        public int NumberOfDays { get; set; } // Days this bus was used

        // Mileage tracking fields
        [Column(TypeName = "decimal(18,2)")]
        public decimal? StartingOdometer { get; set; } // Starting odometer reading in KM

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EndingOdometer { get; set; } // Ending odometer reading in KM

        // Navigation properties for expenses specific to this bus
        public virtual ICollection<FuelEntry> FuelEntries { get; set; } = new List<FuelEntry>();
        public virtual ICollection<OtherExpense> OtherExpenses { get; set; } = new List<OtherExpense>();

        // Calculated properties for this bus
        [NotMapped]
        public decimal TotalFuelCost => FuelEntries?.Sum(f => f.Cost) ?? 0;

        [NotMapped]
        public decimal TotalOtherExpenses => OtherExpenses?.Sum(o => o.Amount) ?? 0;

        [NotMapped]
        public decimal TotalBusExpenses => TotalFuelCost + TotalOtherExpenses + DriverBatta;

        // Mileage calculated properties
        [NotMapped]
        public decimal? TotalDistanceTraveled =>
            (StartingOdometer.HasValue && EndingOdometer.HasValue)
                ? EndingOdometer.Value - StartingOdometer.Value
                : null;

        [NotMapped]
        public decimal? TotalFuelLiters => FuelEntries?.Sum(f => f.Liters) ?? 0;

        [NotMapped]
        public decimal? FuelEfficiency =>
            (TotalDistanceTraveled.HasValue && TotalFuelLiters.HasValue && TotalFuelLiters.Value > 0)
                ? TotalDistanceTraveled.Value / TotalFuelLiters.Value
                : null; // KM per liter
    }
}
