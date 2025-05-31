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
        public async Task<IActionResult> PostBooking(Booking booking)
        {
            try
            {
                Console.WriteLine("Received booking:");
                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(booking));

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

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
}
