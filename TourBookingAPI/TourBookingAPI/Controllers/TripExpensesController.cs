using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripExpensesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/TripExpenses
        [HttpPost]
        public async Task<IActionResult> CreateTripExpense(TripExpenseCreateDto tripExpenseDto)
        {
            try
            {
                // Check if booking exists
                var booking = await _context.Bookings.FindAsync(tripExpenseDto.BookingId);
                if (booking == null)
                {
                    return NotFound($"Booking with ID {tripExpenseDto.BookingId} not found.");
                }

                // Check if trip expense already exists for this booking
                var existingTripExpense = await _context.TripExpenses
                    .FirstOrDefaultAsync(te => te.BookingId == tripExpenseDto.BookingId);
                if (existingTripExpense != null)
                {
                    return BadRequest($"Trip expense already exists for booking ID {tripExpenseDto.BookingId}.");
                }

                // Create new trip expense (now just a container for bus expenses)
                var tripExpense = new TripExpense
                {
                    BookingId = tripExpenseDto.BookingId
                };

                _context.TripExpenses.Add(tripExpense);
                await _context.SaveChangesAsync();

                // Handle both new multi-bus format and legacy single-bus format
                if (tripExpenseDto.BusExpenses != null && tripExpenseDto.BusExpenses.Any())
                {
                    // New multi-bus format
                    foreach (var busDto in tripExpenseDto.BusExpenses)
                    {
                        var busExpense = new BusExpense
                        {
                            TripExpenseId = tripExpense.Id,
                            BusNumber = busDto.BusNumber,
                            DriverBatta = busDto.DriverBatta,
                            NumberOfDays = busDto.NumberOfDays,
                            StartingOdometer = busDto.StartingOdometer,
                            EndingOdometer = busDto.EndingOdometer
                        };

                        _context.BusExpenses.Add(busExpense);
                        await _context.SaveChangesAsync();

                        // Add fuel entries for this bus
                        if (busDto.FuelEntries != null && busDto.FuelEntries.Any())
                        {
                            foreach (var fuelDto in busDto.FuelEntries)
                            {
                                var fuelEntry = new FuelEntry
                                {
                                    BusExpenseId = busExpense.Id,
                                    Location = fuelDto.Location,
                                    Liters = fuelDto.Liters,
                                    Cost = fuelDto.Cost
                                };
                                _context.FuelEntries.Add(fuelEntry);
                            }
                        }

                        // Add other expenses for this bus
                        if (busDto.OtherExpenses != null && busDto.OtherExpenses.Any())
                        {
                            foreach (var otherDto in busDto.OtherExpenses)
                            {
                                var otherExpense = new OtherExpense
                                {
                                    BusExpenseId = busExpense.Id,
                                    Description = otherDto.Description,
                                    Amount = otherDto.Amount
                                };
                                _context.OtherExpenses.Add(otherExpense);
                            }
                        }
                    }
                }
                else
                {
                    // Legacy single-bus format for backward compatibility
                    var busExpense = new BusExpense
                    {
                        TripExpenseId = tripExpense.Id,
                        BusNumber = "Bus 1", // Default bus number
                        DriverBatta = tripExpenseDto.DriverBatta,
                        NumberOfDays = tripExpenseDto.NumberOfDays,
                        StartingOdometer = tripExpenseDto.StartingOdometer,
                        EndingOdometer = tripExpenseDto.EndingOdometer
                    };

                    _context.BusExpenses.Add(busExpense);
                    await _context.SaveChangesAsync();

                    // Add fuel entries to the bus expense
                    if (tripExpenseDto.FuelEntries != null && tripExpenseDto.FuelEntries.Any())
                    {
                        foreach (var fuelDto in tripExpenseDto.FuelEntries)
                        {
                            var fuelEntry = new FuelEntry
                            {
                                BusExpenseId = busExpense.Id,
                                Location = fuelDto.Location,
                                Liters = fuelDto.Liters,
                                Cost = fuelDto.Cost
                            };
                            _context.FuelEntries.Add(fuelEntry);
                        }
                    }

                    // Add other expenses to the bus expense
                    if (tripExpenseDto.OtherExpenses != null && tripExpenseDto.OtherExpenses.Any())
                    {
                        foreach (var otherDto in tripExpenseDto.OtherExpenses)
                        {
                            var otherExpense = new OtherExpense
                            {
                                BusExpenseId = busExpense.Id,
                                Description = otherDto.Description,
                                Amount = otherDto.Amount
                            };
                            _context.OtherExpenses.Add(otherExpense);
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { id = tripExpense.Id, message = "Trip expense created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/TripExpenses
        [HttpGet]
        public async Task<IActionResult> GetAllTripExpenses()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                Console.WriteLine("Starting to fetch trip expenses...");
                // Use optimized query with subqueries to avoid Cartesian product
                // Simple approach: Load data and calculate in memory for now
                var tripExpenses = await _context.TripExpenses
                    .Include(te => te.Booking)
                    .Include(te => te.BusExpenses)
                        .ThenInclude(be => be.FuelEntries)
                    .Include(te => te.BusExpenses)
                        .ThenInclude(be => be.OtherExpenses)
                    .AsNoTracking()
                    .ToListAsync();

                var result = tripExpenses.Select(te => new
                {
                    id = te.Id,
                    bookingId = te.BookingId,
                    customerName = te.Booking.CustomerName,
                    startDate = te.Booking.StartDate,
                    endDate = te.Booking.EndDate,
                    totalRent = te.Booking.TotalRent,
                    numberOfBuses = te.Booking.NumberOfBuses,
                    // Aggregate from all buses for this trip
                    totalDriverBatta = te.BusExpenses.Sum(be => be.DriverBatta),
                    totalFuelCost = te.BusExpenses.Sum(be => be.FuelEntries.Sum(f => f.Cost)),
                    totalOtherExpenses = te.BusExpenses.Sum(be => be.OtherExpenses.Sum(o => o.Amount)),
                    totalBusesUsed = te.BusExpenses.Count,
                    fuelEntriesCount = te.BusExpenses.Sum(be => be.FuelEntries.Count),
                    otherExpensesCount = te.BusExpenses.Sum(be => be.OtherExpenses.Count),
                    totalExpenses = te.BusExpenses.Sum(be => be.DriverBatta + be.FuelEntries.Sum(f => f.Cost) + be.OtherExpenses.Sum(o => o.Amount)),
                    profitOrLoss = te.Booking.TotalRent - te.BusExpenses.Sum(be => be.DriverBatta + be.FuelEntries.Sum(f => f.Cost) + be.OtherExpenses.Sum(o => o.Amount)),
                    // Bus details for multi-bus tracking
                    busDetails = te.BusExpenses.Select(be => new
                    {
                        busNumber = be.BusNumber,
                        driverBatta = be.DriverBatta,
                        numberOfDays = be.NumberOfDays,
                        startingOdometer = be.StartingOdometer,
                        endingOdometer = be.EndingOdometer,
                        totalDistance = (be.StartingOdometer.HasValue && be.EndingOdometer.HasValue)
                            ? be.EndingOdometer.Value - be.StartingOdometer.Value
                            : (decimal?)null,
                        totalFuelLiters = be.FuelEntries.Sum(f => f.Liters),
                        fuelEfficiency = (be.StartingOdometer.HasValue && be.EndingOdometer.HasValue && be.FuelEntries.Sum(f => f.Liters) > 0)
                            ? (be.EndingOdometer.Value - be.StartingOdometer.Value) / be.FuelEntries.Sum(f => f.Liters)
                            : (decimal?)null,
                        fuelCost = be.FuelEntries.Sum(f => f.Cost),
                        otherExpenses = be.OtherExpenses.Sum(o => o.Amount),
                        totalBusExpense = be.DriverBatta + be.FuelEntries.Sum(f => f.Cost) + be.OtherExpenses.Sum(o => o.Amount)
                    }).ToList()
                })
                .OrderByDescending(te => te.startDate)
                .ToList();

                stopwatch.Stop();
                Console.WriteLine($"Trip expenses fetched in {stopwatch.ElapsedMilliseconds}ms. Count: {result.Count}");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/TripExpenses/ByBooking/{bookingId}
        [HttpGet("ByBooking/{bookingId}")]
        public async Task<IActionResult> GetTripExpenseByBooking(int bookingId)
        {
            try
            {
                var tripExpense = await _context.TripExpenses
                    .Include(te => te.Booking)
                    .Include(te => te.BusExpenses)
                        .ThenInclude(be => be.FuelEntries)
                    .Include(te => te.BusExpenses)
                        .ThenInclude(be => be.OtherExpenses)
                    .FirstOrDefaultAsync(te => te.BookingId == bookingId);

                if (tripExpense == null)
                {
                    return NotFound($"No trip expense found for booking ID {bookingId}.");
                }

                var result = new
                {
                    id = tripExpense.Id,
                    bookingId = tripExpense.BookingId,
                    totalDriverBatta = tripExpense.TotalDriverBatta,
                    totalFuelCost = tripExpense.TotalFuelCost,
                    totalOtherExpenses = tripExpense.TotalOtherExpenses,
                    totalExpenses = tripExpense.TotalExpenses,
                    profitOrLoss = tripExpense.ProfitOrLoss,
                    totalBuses = tripExpense.TotalBuses,
                    // Bus-wise breakdown for multi-bus support
                    busExpenses = tripExpense.BusExpenses.Select(be => new
                    {
                        id = be.Id,
                        busNumber = be.BusNumber,
                        driverBatta = be.DriverBatta,
                        numberOfDays = be.NumberOfDays,
                        startingOdometer = be.StartingOdometer,
                        endingOdometer = be.EndingOdometer,
                        totalDistance = be.TotalDistanceTraveled,
                        totalFuelLiters = be.TotalFuelLiters,
                        fuelEfficiency = be.FuelEfficiency,
                        fuelEntries = be.FuelEntries.Select(fe => new
                        {
                            id = fe.Id,
                            location = fe.Location,
                            liters = fe.Liters,
                            cost = fe.Cost
                        }).ToList(),
                        otherExpenses = be.OtherExpenses.Select(oe => new
                        {
                            id = oe.Id,
                            description = oe.Description,
                            amount = oe.Amount
                        }).ToList(),
                        totalFuelCost = be.TotalFuelCost,
                        totalOtherExpenses = be.TotalOtherExpenses,
                        totalBusExpenses = be.TotalBusExpenses
                    }).ToList(),
                    booking = new
                    {
                        id = tripExpense.Booking.Id,
                        customerName = tripExpense.Booking.CustomerName,
                        startDate = tripExpense.Booking.StartDate,
                        endDate = tripExpense.Booking.EndDate,
                        totalRent = tripExpense.Booking.TotalRent,
                        numberOfBuses = tripExpense.Booking.NumberOfBuses
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs for request/response
    public class TripExpenseCreateDto
    {
        public int BookingId { get; set; }
        // Legacy fields for backward compatibility
        public decimal DriverBatta { get; set; }
        public int NumberOfDays { get; set; }
        public decimal? StartingOdometer { get; set; }
        public decimal? EndingOdometer { get; set; }
        public List<FuelEntryDto>? FuelEntries { get; set; }
        public List<OtherExpenseDto>? OtherExpenses { get; set; }

        // New multi-bus support
        public List<BusExpenseDto>? BusExpenses { get; set; }
    }

    public class BusExpenseDto
    {
        public string BusNumber { get; set; } = string.Empty;
        public decimal DriverBatta { get; set; }
        public int NumberOfDays { get; set; }
        public decimal? StartingOdometer { get; set; }
        public decimal? EndingOdometer { get; set; }
        public List<FuelEntryDto> FuelEntries { get; set; } = new List<FuelEntryDto>();
        public List<OtherExpenseDto> OtherExpenses { get; set; } = new List<OtherExpenseDto>();
    }

    public class FuelEntryDto
    {
        public string Location { get; set; } = string.Empty;
        public decimal Liters { get; set; }
        public decimal Cost { get; set; }
    }

    public class OtherExpenseDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
