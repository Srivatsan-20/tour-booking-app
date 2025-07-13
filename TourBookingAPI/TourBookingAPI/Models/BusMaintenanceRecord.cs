using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class BusMaintenanceRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        public DateTime MaintenanceDate { get; set; }

        [Required]
        [StringLength(100)]
        public string MaintenanceType { get; set; } = string.Empty; // Service, Repair, Inspection, etc.

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty; // What was done

        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; } // Cost of maintenance

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OdometerReading { get; set; } // Odometer reading at time of maintenance

        [StringLength(200)]
        public string? ServiceProvider { get; set; } // Garage/service center name

        [StringLength(100)]
        public string? TechnicianName { get; set; } // Technician who performed the work

        [StringLength(50)]
        public string? InvoiceNumber { get; set; } // Invoice/bill number

        public DateTime? NextServiceDate { get; set; } // When next service is due

        [Column(TypeName = "decimal(18,2)")]
        public decimal? NextServiceKm { get; set; } // Odometer reading for next service

        [StringLength(1000)]
        public string? Notes { get; set; } // Additional notes

        [StringLength(500)]
        public string? PartsReplaced { get; set; } // List of parts that were replaced

        [Required]
        public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Completed;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? CreatedBy { get; set; } // Who created this record

        // Navigation properties
        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; } = null!;

        // Calculated properties
        [NotMapped]
        public bool IsWarrantyService => MaintenanceType.ToLower().Contains("warranty");

        [NotMapped]
        public int DaysAgo => (DateTime.Today - MaintenanceDate.Date).Days;

        [NotMapped]
        public bool IsOverdue => NextServiceDate.HasValue && NextServiceDate.Value.Date < DateTime.Today;
    }

    public enum MaintenanceStatus
    {
        Scheduled = 1,      // Maintenance is scheduled
        InProgress = 2,     // Maintenance is currently being performed
        Completed = 3,      // Maintenance completed
        Cancelled = 4,      // Maintenance cancelled
        Pending = 5         // Waiting for parts or approval
    }
}
