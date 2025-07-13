using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    public class Bus
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string RegistrationNumber { get; set; } = string.Empty; // e.g., "MH-01-AB-1234"

        [Required]
        [StringLength(100)]
        public string BusType { get; set; } = string.Empty; // AC Sleeper, Non-AC Sleeper, etc.

        [Required]
        [StringLength(100)]
        public string Make { get; set; } = string.Empty; // Tata, Ashok Leyland, etc.

        [Required]
        [StringLength(100)]
        public string Model { get; set; } = string.Empty; // Starbus, Viking, etc.

        public int Year { get; set; } // Manufacturing year

        public int SeatingCapacity { get; set; } // Number of seats

        public int SleeperCapacity { get; set; } // Number of sleeper berths (if applicable)

        [StringLength(500)]
        public string Features { get; set; } = string.Empty; // AC, GPS, WiFi, etc.

        [Required]
        public BusStatus Status { get; set; } = BusStatus.Available;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CurrentOdometer { get; set; } // Current odometer reading in KM

        public DateTime? LastMaintenanceDate { get; set; }

        public DateTime? NextMaintenanceDate { get; set; }

        [StringLength(200)]
        public string MaintenanceNotes { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DefaultPerDayRent { get; set; } // Default daily rent for this bus

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DefaultMountainRent { get; set; } // Default mountain rent for this bus

        [StringLength(100)]
        public string? AssignedDriver { get; set; } // Currently assigned driver

        [StringLength(20)]
        public string? DriverPhone { get; set; } // Driver contact number

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedDate { get; set; }

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty; // Additional notes about the bus

        // Navigation properties
        public virtual ICollection<BusAllocation> BusAllocations { get; set; } = new List<BusAllocation>();
        public virtual ICollection<BusMaintenanceRecord> MaintenanceRecords { get; set; } = new List<BusMaintenanceRecord>();

        // Calculated properties
        [NotMapped]
        public int TotalCapacity => SeatingCapacity + SleeperCapacity;

        [NotMapped]
        public bool IsAvailable => Status == BusStatus.Available;

        [NotMapped]
        public bool NeedsMaintenance => NextMaintenanceDate.HasValue && NextMaintenanceDate.Value <= DateTime.Today.AddDays(7);

        [NotMapped]
        public int DaysSinceLastMaintenance => LastMaintenanceDate.HasValue 
            ? (DateTime.Today - LastMaintenanceDate.Value).Days 
            : 0;
    }

    public enum BusStatus
    {
        Available = 1,
        OnTrip = 2,
        UnderMaintenance = 3,
        OutOfService = 4,
        Reserved = 5
    }
}
