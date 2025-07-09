using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class BookingBusRent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookingId { get; set; }

        [Required]
        [StringLength(100)]
        public string BusNumber { get; set; } = string.Empty; // Bus 1, Bus 2, etc.

        [Required]
        [StringLength(100)]
        public string BusType { get; set; } = string.Empty; // AC Sleeper, Non-AC, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal PerDayRent { get; set; } // Individual rent per day for this bus

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MountainRent { get; set; } // Individual mountain rent for this bus

        // Navigation property
        public virtual Booking Booking { get; set; } = null!;
    }
}
