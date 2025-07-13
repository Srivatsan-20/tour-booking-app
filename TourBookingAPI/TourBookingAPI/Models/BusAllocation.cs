using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class BusAllocation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        public int BookingId { get; set; }

        public DateTime AllocationDate { get; set; } = DateTime.UtcNow;

        public DateTime TripStartDate { get; set; }

        public DateTime TripEndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AllocatedPerDayRent { get; set; } // Rent agreed for this allocation

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AllocatedMountainRent { get; set; } // Mountain rent for this allocation

        [StringLength(100)]
        public string? AssignedDriver { get; set; } // Driver assigned for this trip

        [StringLength(20)]
        public string? DriverPhone { get; set; } // Driver contact for this trip

        [Column(TypeName = "decimal(18,2)")]
        public decimal? StartingOdometer { get; set; } // Odometer reading at trip start

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EndingOdometer { get; set; } // Odometer reading at trip end

        [Required]
        public AllocationStatus Status { get; set; } = AllocationStatus.Allocated;

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty; // Special instructions or notes

        public DateTime? ActualStartDate { get; set; } // When the trip actually started

        public DateTime? ActualEndDate { get; set; } // When the trip actually ended

        [StringLength(200)]
        public string? CancellationReason { get; set; } // If allocation is cancelled

        public DateTime? CancelledDate { get; set; }

        [StringLength(100)]
        public string? CancelledBy { get; set; } // Who cancelled the allocation

        // Navigation properties
        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; } = null!;

        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;

        // Calculated properties
        [NotMapped]
        public int PlannedDays => (TripEndDate.Date - TripStartDate.Date).Days + 1;

        [NotMapped]
        public int? ActualDays => ActualStartDate.HasValue && ActualEndDate.HasValue
            ? (ActualEndDate.Value.Date - ActualStartDate.Value.Date).Days + 1
            : null;

        [NotMapped]
        public decimal? TotalDistance => StartingOdometer.HasValue && EndingOdometer.HasValue
            ? EndingOdometer.Value - StartingOdometer.Value
            : null;

        [NotMapped]
        public decimal? PlannedRevenue => AllocatedPerDayRent.HasValue
            ? (AllocatedPerDayRent.Value * PlannedDays) + (AllocatedMountainRent ?? 0)
            : null;

        [NotMapped]
        public bool IsActive => Status == AllocationStatus.Allocated || Status == AllocationStatus.InProgress;

        [NotMapped]
        public bool IsOverdue => Status == AllocationStatus.Allocated && TripEndDate.Date < DateTime.Today;
    }

    public enum AllocationStatus
    {
        Allocated = 1,      // Bus is allocated but trip hasn't started
        InProgress = 2,     // Trip is currently in progress
        Completed = 3,      // Trip completed successfully
        Cancelled = 4,      // Allocation cancelled
        NoShow = 5         // Customer didn't show up
    }
}
