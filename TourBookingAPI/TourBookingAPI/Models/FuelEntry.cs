using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class FuelEntry
    {
        public int Id { get; set; }

        [Required]
        public int BusExpenseId { get; set; }

        [ForeignKey("BusExpenseId")]
        public virtual BusExpense BusExpense { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Liters { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; }
    }
}
