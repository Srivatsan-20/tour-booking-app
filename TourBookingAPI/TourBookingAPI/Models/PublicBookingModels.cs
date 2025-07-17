using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TourBookingAPI.Models
{
    // Customer account for public website
    public class CustomerAccount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(15)]
        public string Phone { get; set; }

        [StringLength(100)]
        public string Address { get; set; }

        [StringLength(50)]
        public string City { get; set; }

        [StringLength(50)]
        public string State { get; set; }

        [StringLength(10)]
        public string PostalCode { get; set; }

        [StringLength(100)]
        public string PasswordHash { get; set; }

        [StringLength(100)]
        public string PasswordSalt { get; set; }

        public bool IsVerified { get; set; } = false;

        [StringLength(50)]
        public string VerificationToken { get; set; }

        public DateTime? VerificationTokenExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual ICollection<PublicBooking> Bookings { get; set; } = new List<PublicBooking>();
        public virtual ICollection<CustomerReview> Reviews { get; set; } = new List<CustomerReview>();
    }

    // Public booking made by customers
    public class PublicBooking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string BookingNumber { get; set; } // Unique booking reference

        public int? CustomerAccountId { get; set; } // Optional - can book without account

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string CustomerEmail { get; set; }

        [Required]
        [StringLength(15)]
        public string CustomerPhone { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        [StringLength(100)]
        public string PickupLocation { get; set; }

        [Required]
        [StringLength(100)]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureDate { get; set; }

        public DateTime? ReturnDate { get; set; } // For round trips

        [Required]
        public int PassengerCount { get; set; }

        [StringLength(500)]
        public string SpecialRequirements { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public decimal AdvanceAmount { get; set; }

        public decimal? BalanceAmount { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? CancelledAt { get; set; }

        public string CancellationReason { get; set; }

        // Navigation properties
        [ForeignKey("CustomerAccountId")]
        public virtual CustomerAccount CustomerAccount { get; set; }

        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; }

        public virtual ICollection<CustomerPayment> Payments { get; set; } = new List<CustomerPayment>();
    }

    // Customer payments
    public class CustomerPayment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PublicBookingId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } // CreditCard, DebitCard, NetBanking, UPI, etc.

        [Required]
        [StringLength(50)]
        public string TransactionId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } // Success, Failed, Pending

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string PaymentDetails { get; set; } // JSON with payment gateway response

        // Navigation properties
        [ForeignKey("PublicBookingId")]
        public virtual PublicBooking Booking { get; set; }
    }

    // Customer reviews
    public class CustomerReview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PublicBookingId { get; set; }

        [Required]
        public int CustomerAccountId { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        public int Rating { get; set; } // 1-5 stars

        [Required]
        [StringLength(500)]
        public string Comment { get; set; }

        public bool IsApproved { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PublicBookingId")]
        public virtual PublicBooking Booking { get; set; }

        [ForeignKey("CustomerAccountId")]
        public virtual CustomerAccount CustomerAccount { get; set; }

        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; }
    }

    // Bus photos
    public class BusPhoto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        [StringLength(255)]
        public string FileName { get; set; }

        [Required]
        [StringLength(255)]
        public string FilePath { get; set; }

        [StringLength(100)]
        public string Caption { get; set; }

        public bool IsPrimary { get; set; } = false;

        public int DisplayOrder { get; set; } = 0;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; }
    }

    // Bus amenities
    public class BusAmenity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Icon { get; set; } // FontAwesome or similar icon name

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<BusAmenityMapping> BusAmenityMappings { get; set; } = new List<BusAmenityMapping>();
    }

    // Many-to-many mapping between buses and amenities
    public class BusAmenityMapping
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        public int BusAmenityId { get; set; }

        // Navigation properties
        [ForeignKey("BusId")]
        public virtual Bus Bus { get; set; }

        [ForeignKey("BusAmenityId")]
        public virtual BusAmenity BusAmenity { get; set; }
    }

    // DTO Models for API
    public class PublicBusSearchRequest
    {
        [Required]
        public string PickupLocation { get; set; }

        [Required]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        [Range(1, 100)]
        public int PassengerCount { get; set; }
    }

    public class PublicBusSearchResponse
    {
        public int BusId { get; set; }
        public string BusName { get; set; }
        public string BusType { get; set; }
        public int Capacity { get; set; }
        public string PrimaryImageUrl { get; set; }
        public decimal PricePerDay { get; set; }
        public decimal TotalPrice { get; set; }
        public int NumberOfDays { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public List<string> KeyAmenities { get; set; } = new List<string>();
    }



    public class PublicBusDetailsResponse
    {
        public int BusId { get; set; }
        public string BusName { get; set; }
        public string BusType { get; set; }
        public int Capacity { get; set; }
        public string Description { get; set; }
        public decimal PricePerDay { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public List<BusPhotoDto> Photos { get; set; } = new List<BusPhotoDto>();
        public List<BusAmenityDto> Amenities { get; set; } = new List<BusAmenityDto>();
        public List<CustomerReviewDto> Reviews { get; set; } = new List<CustomerReviewDto>();
    }

    public class BusPhotoDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Caption { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class BusAmenityDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
    }

    public class CustomerReviewDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePublicBookingRequest
    {
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; }

        [Required]
        [StringLength(15)]
        public string CustomerPhone { get; set; }

        [Required]
        public int BusId { get; set; }

        [Required]
        public string PickupLocation { get; set; }

        [Required]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        [Range(1, 100)]
        public int PassengerCount { get; set; }

        public string SpecialRequirements { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public decimal AdvanceAmount { get; set; }
    }

    public class PublicBookingResponse
    {
        public int BookingId { get; set; }
        public string BookingNumber { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AdvanceAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PaymentUrl { get; set; } // For payment gateway redirect
    }

    public class CustomerAccountRegistrationRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(15)]
        public string Phone { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
    }

    public class CustomerLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class CustomerLoginResponse
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
