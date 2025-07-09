using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostBooking(BookingCreateDto bookingDto)
        {
            try
            {
                Console.WriteLine("Received booking:");
                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(bookingDto));

                var booking = new Booking
                {
                    CustomerName = bookingDto.CustomerName,
                    Phone = bookingDto.Phone,
                    Email = bookingDto.Email,
                    StartDate = bookingDto.StartDate,
                    EndDate = bookingDto.EndDate,
                    PickupLocation = bookingDto.PickupLocation,
                    DropLocation = bookingDto.DropLocation,
                    NumberOfPassengers = bookingDto.NumberOfPassengers,
                    BusType = bookingDto.BusType,
                    NumberOfBuses = bookingDto.NumberOfBuses,
                    PlacesToCover = bookingDto.PlacesToCover,
                    PreferredRoute = bookingDto.PreferredRoute,
                    SpecialRequirements = bookingDto.SpecialRequirements,
                    PaymentMode = bookingDto.PaymentMode,
                    Language = bookingDto.Language,
                    UseIndividualBusRates = bookingDto.UseIndividualBusRates,
                    PerDayRent = bookingDto.PerDayRent,
                    MountainRent = bookingDto.MountainRent,
                    AdvancePaid = bookingDto.AdvancePaid,
                    TotalRent = bookingDto.TotalRent
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                // If using individual bus rates, save the bus rent details
                if (bookingDto.UseIndividualBusRates && bookingDto.BusRents != null && bookingDto.BusRents.Any())
                {
                    foreach (var busRentDto in bookingDto.BusRents)
                    {
                        var busRent = new BookingBusRent
                        {
                            BookingId = booking.Id,
                            BusNumber = busRentDto.BusNumber,
                            BusType = busRentDto.BusType,
                            PerDayRent = busRentDto.PerDayRent,
                            MountainRent = busRentDto.MountainRent
                        };
                        _context.BookingBusRents.Add(busRent);
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new { id = booking.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR SAVING BOOKING: " + ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Bookings/Upcoming
        [HttpGet("Upcoming")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetUpcomingBookings()
        {
            var today = DateTime.Today;
            var upcoming = await _context.Bookings
                .Where(b => b.StartDate >= today)
                .OrderBy(b => b.StartDate)
                .ToListAsync();

            return Ok(upcoming);
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .OrderByDescending(b => b.StartDate)
                .Select(b => new
                {
                    id = b.Id,
                    customerName = b.CustomerName,
                    startDate = b.StartDate,
                    endDate = b.EndDate,
                    numberOfDays = (b.EndDate - b.StartDate).Days + 1,
                    numberOfBuses = b.NumberOfBuses,
                    perDayRent = b.PerDayRent,
                    mountainRent = b.MountainRent,
                    totalRent = b.TotalRent,
                    advancePaid = b.AdvancePaid,
                    balanceToBePaid = b.TotalRent - b.AdvancePaid,
                    pickupLocation = b.PickupLocation,
                    dropLocation = b.DropLocation
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }


    }

    // DTOs for individual bus rent configuration
    public class BookingCreateDto
    {
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
        public string Language { get; set; } = string.Empty;

        // Rent configuration
        public bool UseIndividualBusRates { get; set; } = false;
        public decimal PerDayRent { get; set; } // Used when UseIndividualBusRates = false
        public decimal? MountainRent { get; set; } // Used when UseIndividualBusRates = false
        public decimal AdvancePaid { get; set; }
        public decimal TotalRent { get; set; }

        // Individual bus rent details (used when UseIndividualBusRates = true)
        public List<BusRentDto>? BusRents { get; set; }
    }

    public class BusRentDto
    {
        public string BusNumber { get; set; } = string.Empty;
        public string BusType { get; set; } = string.Empty;
        public decimal PerDayRent { get; set; }
        public decimal? MountainRent { get; set; }
    }
}
