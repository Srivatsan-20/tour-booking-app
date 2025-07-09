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
        public decimal TotalRent { get; set; }
    }
}
