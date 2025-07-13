using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    // Tourist Place Master Data
    public class TouristPlace
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; }

        [Required]
        [StringLength(50)]
        public string State { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } // Temple, Beach, Hill Station, Heritage, etc.

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public int DefaultVisitDurationMinutes { get; set; } = 120; // 2 hours default

        [StringLength(500)]
        public string Description { get; set; }

        [StringLength(1000)]
        public string Attractions { get; set; } // JSON array of attractions

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    // Planned Tour Trip
    public class PlannedTrip
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string TripName { get; set; }

        [Required]
        [StringLength(100)]
        public string StartingPoint { get; set; }

        [Required]
        public double StartLatitude { get; set; }

        [Required]
        public double StartLongitude { get; set; }

        [Required]
        public int NumberOfDays { get; set; }

        [Required]
        public int MaxDrivingHoursPerDay { get; set; } = 10;

        public DateTime ReturnDeadline { get; set; } // Must return by this time

        [Required]
        public int TotalDistanceKm { get; set; }

        [Required]
        public int TotalDrivingMinutes { get; set; }

        [Required]
        public decimal EstimatedFuelCost { get; set; }

        [StringLength(1000)]
        public string WarningsAndNotes { get; set; }

        [StringLength(2000)]
        public string ExcludedPlaces { get; set; } // JSON array of excluded places with reasons

        public bool IsFeasible { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string CreatedBy { get; set; }

        // Navigation properties
        public virtual ICollection<TripDay> TripDays { get; set; } = new List<TripDay>();
        public virtual ICollection<TripPlace> TripPlaces { get; set; } = new List<TripPlace>();
    }

    // Day-wise itinerary
    public class TripDay
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlannedTripId { get; set; }

        [Required]
        public int DayNumber { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public int TotalDrivingMinutes { get; set; }

        [Required]
        public int TotalDistanceKm { get; set; }

        [StringLength(500)]
        public string DaySummary { get; set; }

        // Navigation properties
        [ForeignKey("PlannedTripId")]
        public virtual PlannedTrip PlannedTrip { get; set; }

        public virtual ICollection<TripStop> TripStops { get; set; } = new List<TripStop>();
    }

    // Individual stops in the itinerary
    public class TripStop
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TripDayId { get; set; }

        [Required]
        public int SequenceNumber { get; set; }

        [Required]
        [StringLength(20)]
        public string StopType { get; set; } // "Visit" or "Travel"

        // For Visit stops
        public int? TouristPlaceId { get; set; }

        [StringLength(100)]
        public string PlaceName { get; set; }

        public int VisitDurationMinutes { get; set; }

        // For Travel stops
        [StringLength(100)]
        public string FromLocation { get; set; }

        [StringLength(100)]
        public string ToLocation { get; set; }

        public int TravelTimeMinutes { get; set; }

        public int DistanceKm { get; set; }

        // Timing
        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [StringLength(500)]
        public string Notes { get; set; }

        // Navigation properties
        [ForeignKey("TripDayId")]
        public virtual TripDay TripDay { get; set; }

        [ForeignKey("TouristPlaceId")]
        public virtual TouristPlace TouristPlace { get; set; }
    }

    // Places selected for the trip
    public class TripPlace
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlannedTripId { get; set; }

        [Required]
        public int TouristPlaceId { get; set; }

        public int CustomVisitDurationMinutes { get; set; }

        public bool IsIncluded { get; set; } = true;

        [StringLength(200)]
        public string ExclusionReason { get; set; }

        public int Priority { get; set; } = 1; // 1 = High, 2 = Medium, 3 = Low

        // Navigation properties
        [ForeignKey("PlannedTripId")]
        public virtual PlannedTrip PlannedTrip { get; set; }

        [ForeignKey("TouristPlaceId")]
        public virtual TouristPlace TouristPlace { get; set; }
    }

    // DTO Models for API
    public class TourPlanRequest
    {
        [Required]
        public string StartingPoint { get; set; } = "Dharmapuri";

        [Required]
        public List<TourPlaceRequest> Places { get; set; } = new List<TourPlaceRequest>();

        [Required]
        [Range(1, 30)]
        public int NumberOfDays { get; set; }

        [Range(6, 16)]
        public int MaxDrivingHoursPerDay { get; set; } = 10;

        public DateTime? ReturnDeadline { get; set; } // If not provided, defaults to 1:00 AM next day

        public string TripName { get; set; }
    }

    public class TourPlaceRequest
    {
        [Required]
        public string PlaceName { get; set; }

        public int? CustomVisitDurationMinutes { get; set; }

        public int Priority { get; set; } = 1; // 1 = High, 2 = Medium, 3 = Low
    }

    public class TourPlanResponse
    {
        public int TripId { get; set; }
        public bool IsFeasible { get; set; }
        public string TripName { get; set; }
        public int TotalDays { get; set; }
        public int TotalDistanceKm { get; set; }
        public int TotalDrivingHours { get; set; }
        public decimal EstimatedFuelCost { get; set; }
        public List<string> Warnings { get; set; } = new List<string>();
        public List<string> ExcludedPlaces { get; set; } = new List<string>();
        public List<DayItinerary> DayItineraries { get; set; } = new List<DayItinerary>();
        public TripSummary Summary { get; set; }
    }

    public class DayItinerary
    {
        public int DayNumber { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DrivingHours { get; set; }
        public int TotalDistanceKm { get; set; }
        public string Summary { get; set; }
        public List<ItineraryStop> Stops { get; set; } = new List<ItineraryStop>();
    }

    public class ItineraryStop
    {
        public int SequenceNumber { get; set; }
        public string StopType { get; set; } // "Visit" or "Travel"
        public string PlaceName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public int? DistanceKm { get; set; }
        public string FromLocation { get; set; }
        public string ToLocation { get; set; }
        public string Notes { get; set; }
    }

    public class TripSummary
    {
        public int TotalPlaces { get; set; }
        public int PlacesVisited { get; set; }
        public int PlacesExcluded { get; set; }
        public int TotalDrivingHours { get; set; }
        public int TotalVisitingHours { get; set; }
        public decimal EfficiencyPercentage { get; set; }
        public DateTime ReturnTime { get; set; }
        public bool MeetsReturnDeadline { get; set; }
    }
}
