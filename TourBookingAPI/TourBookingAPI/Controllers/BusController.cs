using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Bus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBuses()
        {
            return await _context.Buses
                .Include(b => b.BusAllocations)
                .Include(b => b.MaintenanceRecords)
                .OrderBy(b => b.RegistrationNumber)
                .ToListAsync();
        }

        // GET: api/Bus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bus>> GetBus(int id)
        {
            var bus = await _context.Buses
                .Include(b => b.BusAllocations)
                    .ThenInclude(ba => ba.Booking)
                .Include(b => b.MaintenanceRecords)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bus == null)
            {
                return NotFound();
            }

            return bus;
        }

        // GET: api/Bus/Available
        [HttpGet("Available")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetAvailableBuses([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Buses.Where(b => b.Status == BusStatus.Available);

            // If dates are provided, check for conflicts with existing allocations
            if (startDate.HasValue && endDate.HasValue)
            {
                var conflictingBusIds = await _context.BusAllocations
                    .Where(ba => ba.Status == AllocationStatus.Allocated || ba.Status == AllocationStatus.InProgress)
                    .Where(ba => ba.TripStartDate.Date <= endDate.Value.Date && ba.TripEndDate.Date >= startDate.Value.Date)
                    .Select(ba => ba.BusId)
                    .ToListAsync();

                query = query.Where(b => !conflictingBusIds.Contains(b.Id));
            }

            return await query.OrderBy(b => b.RegistrationNumber).ToListAsync();
        }

        // GET: api/Bus/ByType/{busType}
        [HttpGet("ByType/{busType}")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBusesByType(string busType)
        {
            return await _context.Buses
                .Where(b => b.BusType.ToLower() == busType.ToLower() && b.Status == BusStatus.Available)
                .OrderBy(b => b.RegistrationNumber)
                .ToListAsync();
        }

        // POST: api/Bus
        [HttpPost]
        public async Task<ActionResult<Bus>> PostBus(BusCreateDto busDto)
        {
            try
            {
                // Check if registration number already exists
                var existingBus = await _context.Buses
                    .FirstOrDefaultAsync(b => b.RegistrationNumber.ToLower() == busDto.RegistrationNumber.ToLower());

                if (existingBus != null)
                {
                    return BadRequest("A bus with this registration number already exists.");
                }

                var bus = new Bus
                {
                    RegistrationNumber = busDto.RegistrationNumber,
                    BusType = busDto.BusType,
                    Make = busDto.Make,
                    Model = busDto.Model,
                    Year = busDto.Year,
                    SeatingCapacity = busDto.SeatingCapacity,
                    SleeperCapacity = busDto.SleeperCapacity,
                    Features = busDto.Features,
                    Status = busDto.Status,
                    CurrentOdometer = busDto.CurrentOdometer,
                    DefaultPerDayRent = busDto.DefaultPerDayRent,
                    DefaultMountainRent = busDto.DefaultMountainRent,
                    AssignedDriver = busDto.AssignedDriver,
                    DriverPhone = busDto.DriverPhone,
                    Notes = busDto.Notes,
                    CreatedDate = DateTime.UtcNow
                };

                _context.Buses.Add(bus);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBus", new { id = bus.Id }, bus);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Bus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBus(int id, BusUpdateDto busDto)
        {
            try
            {
                var bus = await _context.Buses.FindAsync(id);
                if (bus == null)
                {
                    return NotFound();
                }

                // Check if registration number is being changed and if it conflicts
                if (bus.RegistrationNumber.ToLower() != busDto.RegistrationNumber.ToLower())
                {
                    var existingBus = await _context.Buses
                        .FirstOrDefaultAsync(b => b.RegistrationNumber.ToLower() == busDto.RegistrationNumber.ToLower());

                    if (existingBus != null)
                    {
                        return BadRequest("A bus with this registration number already exists.");
                    }
                }

                // Update bus properties
                bus.RegistrationNumber = busDto.RegistrationNumber;
                bus.BusType = busDto.BusType;
                bus.Make = busDto.Make;
                bus.Model = busDto.Model;
                bus.Year = busDto.Year;
                bus.SeatingCapacity = busDto.SeatingCapacity;
                bus.SleeperCapacity = busDto.SleeperCapacity;
                bus.Features = busDto.Features;
                bus.Status = busDto.Status;
                bus.CurrentOdometer = busDto.CurrentOdometer;
                bus.DefaultPerDayRent = busDto.DefaultPerDayRent;
                bus.DefaultMountainRent = busDto.DefaultMountainRent;
                bus.AssignedDriver = busDto.AssignedDriver;
                bus.DriverPhone = busDto.DriverPhone;
                bus.Notes = busDto.Notes;
                bus.UpdatedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Bus/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            try
            {
                var bus = await _context.Buses
                    .Include(b => b.BusAllocations)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (bus == null)
                {
                    return NotFound();
                }

                // Check if bus has active allocations
                var hasActiveAllocations = bus.BusAllocations
                    .Any(ba => ba.Status == AllocationStatus.Allocated || ba.Status == AllocationStatus.InProgress);

                if (hasActiveAllocations)
                {
                    return BadRequest("Cannot delete bus with active allocations. Please complete or cancel all allocations first.");
                }

                _context.Buses.Remove(bus);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Bus/Dashboard
        [HttpGet("Dashboard")]
        public async Task<ActionResult<BusDashboardDto>> GetBusDashboard()
        {
            try
            {
                var totalBuses = await _context.Buses.CountAsync();
                var availableBuses = await _context.Buses.CountAsync(b => b.Status == BusStatus.Available);
                var busesOnTrip = await _context.Buses.CountAsync(b => b.Status == BusStatus.OnTrip);
                var busesUnderMaintenance = await _context.Buses.CountAsync(b => b.Status == BusStatus.UnderMaintenance);
                var busesNeedingMaintenance = await _context.Buses.CountAsync(b => b.NextMaintenanceDate.HasValue && b.NextMaintenanceDate.Value <= DateTime.Today.AddDays(7));

                var dashboard = new BusDashboardDto
                {
                    TotalBuses = totalBuses,
                    AvailableBuses = availableBuses,
                    BusesOnTrip = busesOnTrip,
                    BusesUnderMaintenance = busesUnderMaintenance,
                    BusesNeedingMaintenance = busesNeedingMaintenance,
                    UtilizationRate = totalBuses > 0 ? (decimal)busesOnTrip / totalBuses * 100 : 0
                };

                return dashboard;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs for Bus management
    public class BusCreateDto
    {
        public string RegistrationNumber { get; set; } = string.Empty;
        public string BusType { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int SeatingCapacity { get; set; }
        public int SleeperCapacity { get; set; }
        public string Features { get; set; } = string.Empty;
        public BusStatus Status { get; set; } = BusStatus.Available;
        public decimal? CurrentOdometer { get; set; }
        public decimal DefaultPerDayRent { get; set; }
        public decimal? DefaultMountainRent { get; set; }
        public string? AssignedDriver { get; set; }
        public string? DriverPhone { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class BusUpdateDto
    {
        public string RegistrationNumber { get; set; } = string.Empty;
        public string BusType { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int SeatingCapacity { get; set; }
        public int SleeperCapacity { get; set; }
        public string Features { get; set; } = string.Empty;
        public BusStatus Status { get; set; }
        public decimal? CurrentOdometer { get; set; }
        public decimal DefaultPerDayRent { get; set; }
        public decimal? DefaultMountainRent { get; set; }
        public string? AssignedDriver { get; set; }
        public string? DriverPhone { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class BusDashboardDto
    {
        public int TotalBuses { get; set; }
        public int AvailableBuses { get; set; }
        public int BusesOnTrip { get; set; }
        public int BusesUnderMaintenance { get; set; }
        public int BusesNeedingMaintenance { get; set; }
        public decimal UtilizationRate { get; set; }
    }
}
