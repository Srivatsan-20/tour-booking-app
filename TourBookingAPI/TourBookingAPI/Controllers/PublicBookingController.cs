using Microsoft.AspNetCore.Mvc;
using TourBookingAPI.Models;
using TourBookingAPI.Services;

namespace TourBookingAPI.Controllers
{
    [ApiController]
    [Route("api/public/booking")]
    public class PublicBookingController : ControllerBase
    {
        private readonly IPublicBookingService _bookingService;
        private readonly ILogger<PublicBookingController> _logger;

        public PublicBookingController(IPublicBookingService bookingService, ILogger<PublicBookingController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        /// <summary>
        /// Search for available buses based on criteria
        /// </summary>
        [HttpPost("search")]
        public async Task<ActionResult<List<PublicBusSearchResponse>>> SearchBuses([FromBody] PublicBusSearchRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var buses = await _bookingService.SearchAvailableBusesAsync(request);
                return Ok(buses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching buses");
                return StatusCode(500, new { message = "An error occurred while searching for buses" });
            }
        }

        /// <summary>
        /// Get detailed information about a specific bus
        /// </summary>
        [HttpGet("bus/{busId}")]
        public async Task<ActionResult<PublicBusDetailsResponse>> GetBusDetails(int busId)
        {
            try
            {
                var busDetails = await _bookingService.GetBusDetailsAsync(busId);
                
                if (busDetails == null)
                    return NotFound(new { message = "Bus not found" });

                return Ok(busDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bus details for {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while fetching bus details" });
            }
        }

        /// <summary>
        /// Create a new booking
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<PublicBookingResponse>> CreateBooking([FromBody] CreatePublicBookingRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var booking = await _bookingService.CreateBookingAsync(request);
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                return StatusCode(500, new { message = "An error occurred while creating the booking" });
            }
        }

        /// <summary>
        /// Get booking details by booking number
        /// </summary>
        [HttpGet("{bookingNumber}")]
        public async Task<ActionResult<PublicBooking>> GetBooking(string bookingNumber)
        {
            try
            {
                var booking = await _bookingService.GetBookingByNumberAsync(bookingNumber);
                
                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting booking {BookingNumber}", bookingNumber);
                return StatusCode(500, new { message = "An error occurred while fetching the booking" });
            }
        }

        /// <summary>
        /// Cancel a booking
        /// </summary>
        [HttpPost("{bookingId}/cancel")]
        public async Task<ActionResult> CancelBooking(int bookingId, [FromBody] CancelBookingRequest request)
        {
            try
            {
                var success = await _bookingService.CancelBookingAsync(bookingId, request.Reason);
                
                if (!success)
                    return NotFound(new { message = "Booking not found or already cancelled" });

                return Ok(new { message = "Booking cancelled successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling booking {BookingId}", bookingId);
                return StatusCode(500, new { message = "An error occurred while cancelling the booking" });
            }
        }

        /// <summary>
        /// Get reviews for a specific bus
        /// </summary>
        [HttpGet("bus/{busId}/reviews")]
        public async Task<ActionResult<List<CustomerReview>>> GetBusReviews(int busId)
        {
            try
            {
                var reviews = await _bookingService.GetBusReviewsAsync(busId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reviews for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while fetching reviews" });
            }
        }

        /// <summary>
        /// Add a review for a booking
        /// </summary>
        [HttpPost("review")]
        public async Task<ActionResult<CustomerReview>> AddReview([FromBody] AddReviewRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var review = await _bookingService.AddReviewAsync(
                    request.BookingId, 
                    request.CustomerId, 
                    request.Rating, 
                    request.Comment);

                return Ok(review);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding review");
                return StatusCode(500, new { message = "An error occurred while adding the review" });
            }
        }

        /// <summary>
        /// Get featured buses for homepage
        /// </summary>
        [HttpGet("featured")]
        public async Task<ActionResult<List<PublicBusSearchResponse>>> GetFeaturedBuses()
        {
            try
            {
                // Get top-rated buses for featured section
                var searchRequest = new PublicBusSearchRequest
                {
                    PickupLocation = "Any",
                    Destination = "Any",
                    DepartureDate = DateTime.Today.AddDays(1),
                    PassengerCount = 1
                };

                var buses = await _bookingService.SearchAvailableBusesAsync(searchRequest);
                
                // Return top 6 buses sorted by rating
                var featuredBuses = buses
                    .OrderByDescending(b => b.AverageRating)
                    .ThenByDescending(b => b.ReviewCount)
                    .Take(6)
                    .ToList();

                return Ok(featuredBuses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting featured buses");
                return StatusCode(500, new { message = "An error occurred while fetching featured buses" });
            }
        }

        /// <summary>
        /// Get quick availability check
        /// </summary>
        [HttpGet("availability")]
        public async Task<ActionResult<object>> CheckAvailability(
            [FromQuery] DateTime departureDate,
            [FromQuery] DateTime? returnDate,
            [FromQuery] int passengerCount = 1)
        {
            try
            {
                var searchRequest = new PublicBusSearchRequest
                {
                    PickupLocation = "Any",
                    Destination = "Any",
                    DepartureDate = departureDate,
                    ReturnDate = returnDate,
                    PassengerCount = passengerCount
                };

                var buses = await _bookingService.SearchAvailableBusesAsync(searchRequest);

                var availability = new
                {
                    Date = departureDate.ToString("yyyy-MM-dd"),
                    ReturnDate = returnDate?.ToString("yyyy-MM-dd"),
                    AvailableBuses = buses.Count,
                    MinPrice = buses.Any() ? buses.Min(b => b.TotalPrice) : 0,
                    MaxPrice = buses.Any() ? buses.Max(b => b.TotalPrice) : 0,
                    AveragePrice = buses.Any() ? buses.Average(b => b.TotalPrice) : 0
                };

                return Ok(availability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking availability");
                return StatusCode(500, new { message = "An error occurred while checking availability" });
            }
        }
    }

    // Additional DTOs
    public class CancelBookingRequest
    {
        public string Reason { get; set; } = "Customer requested cancellation";
    }

    public class AddReviewRequest
    {
        public int BookingId { get; set; }
        public int CustomerId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
