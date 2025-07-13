using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusAllocationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusAllocationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BusAllocation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusAllocation>>> GetBusAllocations()
        {
            return await _context.BusAllocations
                .Include(ba => ba.Bus)
                .Include(ba => ba.Booking)
                .OrderByDescending(ba => ba.AllocationDate)
                .ToListAsync();
        }

        // GET: api/BusAllocation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BusAllocation>> GetBusAllocation(int id)
        {
            var busAllocation = await _context.BusAllocations
                .Include(ba => ba.Bus)
                .Include(ba => ba.Booking)
                .FirstOrDefaultAsync(ba => ba.Id == id);

            if (busAllocation == null)
            {
                return NotFound();
            }

            return busAllocation;
        }

        // GET: api/BusAllocation/ByBooking/5
        [HttpGet("ByBooking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<BusAllocation>>> GetAllocationsByBooking(int bookingId)
        {
            return await _context.BusAllocations
                .Include(ba => ba.Bus)
                .Where(ba => ba.BookingId == bookingId)
                .OrderBy(ba => ba.Bus.RegistrationNumber)
                .ToListAsync();
        }

        // GET: api/BusAllocation/ByBus/5
        [HttpGet("ByBus/{busId}")]
        public async Task<ActionResult<IEnumerable<BusAllocation>>> GetAllocationsByBus(int busId)
        {
            return await _context.BusAllocations
                .Include(ba => ba.Booking)
                .Where(ba => ba.BusId == busId)
                .OrderByDescending(ba => ba.TripStartDate)
                .ToListAsync();
        }

        // GET: api/BusAllocation/Calendar
        [HttpGet("Calendar")]
        public async Task<ActionResult<IEnumerable<CalendarEventDto>>> GetAllocationCalendar([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var start = startDate ?? DateTime.Today.AddDays(-30);
            var end = endDate ?? DateTime.Today.AddDays(90);

            var allocations = await _context.BusAllocations
                .Include(ba => ba.Bus)
                .Include(ba => ba.Booking)
                .Where(ba => ba.TripStartDate.Date <= end.Date && ba.TripEndDate.Date >= start.Date)
                .Where(ba => ba.Status == AllocationStatus.Allocated || ba.Status == AllocationStatus.InProgress)
                .ToListAsync();

            var events = allocations.Select(ba => new CalendarEventDto
            {
                Id = ba.Id,
                Title = $"{ba.Bus.RegistrationNumber} - {ba.Booking.CustomerName}",
                Start = ba.TripStartDate,
                End = ba.TripEndDate.AddDays(1), // Add 1 day for calendar display
                BusId = ba.BusId,
                BookingId = ba.BookingId,
                Status = ba.Status.ToString(),
                Color = GetStatusColor(ba.Status)
            }).ToList();

            return events;
        }

        // POST: api/BusAllocation
        [HttpPost]
        public async Task<ActionResult<BusAllocation>> PostBusAllocation(BusAllocationCreateDto allocationDto)
        {
            try
            {
                // Validate bus exists and is available
                var bus = await _context.Buses.FindAsync(allocationDto.BusId);
                if (bus == null)
                {
                    return BadRequest("Bus not found.");
                }

                // Validate booking exists
                var booking = await _context.Bookings.FindAsync(allocationDto.BookingId);
                if (booking == null)
                {
                    return BadRequest("Booking not found.");
                }

                // Check for conflicting allocations
                var hasConflict = await _context.BusAllocations
                    .AnyAsync(ba => ba.BusId == allocationDto.BusId &&
                                   (ba.Status == AllocationStatus.Allocated || ba.Status == AllocationStatus.InProgress) &&
                                   ba.TripStartDate.Date <= allocationDto.TripEndDate.Date &&
                                   ba.TripEndDate.Date >= allocationDto.TripStartDate.Date);

                if (hasConflict)
                {
                    return BadRequest("Bus is already allocated for the specified date range.");
                }

                var allocation = new BusAllocation
                {
                    BusId = allocationDto.BusId,
                    BookingId = allocationDto.BookingId,
                    TripStartDate = allocationDto.TripStartDate,
                    TripEndDate = allocationDto.TripEndDate,
                    AllocatedPerDayRent = allocationDto.AllocatedPerDayRent,
                    AllocatedMountainRent = allocationDto.AllocatedMountainRent,
                    AssignedDriver = allocationDto.AssignedDriver,
                    DriverPhone = allocationDto.DriverPhone,
                    Notes = allocationDto.Notes,
                    AllocationDate = DateTime.UtcNow,
                    Status = AllocationStatus.Allocated
                };

                _context.BusAllocations.Add(allocation);

                // Update bus status
                bus.Status = BusStatus.Reserved;

                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBusAllocation", new { id = allocation.Id }, allocation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/BusAllocation/5/Status
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateAllocationStatus(int id, AllocationStatusUpdateDto statusDto)
        {
            try
            {
                var allocation = await _context.BusAllocations
                    .Include(ba => ba.Bus)
                    .FirstOrDefaultAsync(ba => ba.Id == id);

                if (allocation == null)
                {
                    return NotFound();
                }

                var oldStatus = allocation.Status;
                allocation.Status = statusDto.Status;

                // Update timestamps based on status
                switch (statusDto.Status)
                {
                    case AllocationStatus.InProgress:
                        allocation.ActualStartDate = DateTime.UtcNow;
                        allocation.Bus.Status = BusStatus.OnTrip;
                        break;
                    case AllocationStatus.Completed:
                        allocation.ActualEndDate = DateTime.UtcNow;
                        allocation.Bus.Status = BusStatus.Available;
                        break;
                    case AllocationStatus.Cancelled:
                        allocation.CancelledDate = DateTime.UtcNow;
                        allocation.CancellationReason = statusDto.Reason;
                        allocation.CancelledBy = statusDto.CancelledBy;
                        allocation.Bus.Status = BusStatus.Available;
                        break;
                }

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/BusAllocation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusAllocation(int id)
        {
            try
            {
                var allocation = await _context.BusAllocations
                    .Include(ba => ba.Bus)
                    .FirstOrDefaultAsync(ba => ba.Id == id);

                if (allocation == null)
                {
                    return NotFound();
                }

                // Only allow deletion if not in progress
                if (allocation.Status == AllocationStatus.InProgress)
                {
                    return BadRequest("Cannot delete allocation that is in progress. Please complete or cancel first.");
                }

                // Update bus status back to available
                allocation.Bus.Status = BusStatus.Available;

                _context.BusAllocations.Remove(allocation);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GetStatusColor(AllocationStatus status)
        {
            return status switch
            {
                AllocationStatus.Allocated => "#007bff",    // Blue
                AllocationStatus.InProgress => "#28a745",   // Green
                AllocationStatus.Completed => "#6c757d",    // Gray
                AllocationStatus.Cancelled => "#dc3545",    // Red
                AllocationStatus.NoShow => "#ffc107",       // Yellow
                _ => "#007bff"
            };
        }
    }

    // DTOs for Bus Allocation
    public class BusAllocationCreateDto
    {
        public int BusId { get; set; }
        public int BookingId { get; set; }
        public DateTime TripStartDate { get; set; }
        public DateTime TripEndDate { get; set; }
        public decimal? AllocatedPerDayRent { get; set; }
        public decimal? AllocatedMountainRent { get; set; }
        public string? AssignedDriver { get; set; }
        public string? DriverPhone { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class AllocationStatusUpdateDto
    {
        public AllocationStatus Status { get; set; }
        public string? Reason { get; set; }
        public string? CancelledBy { get; set; }
    }

    public class CalendarEventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int BusId { get; set; }
        public int BookingId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }
}
