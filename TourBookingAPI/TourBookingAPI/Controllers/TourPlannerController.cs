using Microsoft.AspNetCore.Mvc;
using TourBookingAPI.Models;
using TourBookingAPI.Services;

namespace TourBookingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TourPlannerController : ControllerBase
    {
        private readonly ITourPlannerService _tourPlannerService;
        private readonly ILogger<TourPlannerController> _logger;

        public TourPlannerController(ITourPlannerService tourPlannerService, ILogger<TourPlannerController> logger)
        {
            _tourPlannerService = tourPlannerService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new tour plan with intelligent routing and time optimization
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<TourPlanResponse>> CreateTourPlan([FromBody] TourPlanRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Creating tour plan for {PlaceCount} places over {Days} days",
                    request.Places.Count, request.NumberOfDays);

                var result = await _tourPlannerService.CreateTourPlanAsync(request);

                if (result.IsFeasible)
                {
                    // Automatically save feasible plans
                    var userId = "anonymous"; // For now, since we don't have auth
                    await _tourPlannerService.SaveTourPlanAsync(result, userId);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tour plan");
                return StatusCode(500, new { message = "An error occurred while creating the tour plan" });
            }
        }

        /// <summary>
        /// Get available tourist places for planning
        /// </summary>
        [HttpGet("places")]
        public async Task<ActionResult<List<TouristPlace>>> GetAvailablePlaces()
        {
            try
            {
                var places = await _tourPlannerService.GetAvailablePlacesAsync();

                // If no places in database, return fallback data
                if (!places.Any())
                {
                    places = GetFallbackPlaces();
                }

                return Ok(places);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available places, using fallback data");
                return Ok(GetFallbackPlaces());
            }
        }

        private List<TouristPlace> GetFallbackPlaces()
        {
            return new List<TouristPlace>
            {
                new TouristPlace { Id = 1, Name = "Chennai", City = "Chennai", State = "Tamil Nadu", Category = "City/Beach", Latitude = 13.0827, Longitude = 80.2707, DefaultVisitDurationMinutes = 480, Description = "Capital city with beaches, temples, and cultural sites", IsActive = true },
                new TouristPlace { Id = 2, Name = "Kanyakumari", City = "Kanyakumari", State = "Tamil Nadu", Category = "Beach/Temple", Latitude = 8.0883, Longitude = 77.5385, DefaultVisitDurationMinutes = 360, Description = "Southernmost tip of India, confluence of three seas", IsActive = true },
                new TouristPlace { Id = 3, Name = "Madurai", City = "Madurai", State = "Tamil Nadu", Category = "Temple/Heritage", Latitude = 9.9252, Longitude = 78.1198, DefaultVisitDurationMinutes = 360, Description = "Temple city famous for Meenakshi Amman Temple", IsActive = true },
                new TouristPlace { Id = 4, Name = "Kodaikanal", City = "Kodaikanal", State = "Tamil Nadu", Category = "Hill Station", Latitude = 10.2381, Longitude = 77.4892, DefaultVisitDurationMinutes = 480, Description = "Princess of Hill Stations with lakes and valleys", IsActive = true },
                new TouristPlace { Id = 5, Name = "Rameshwaram", City = "Rameshwaram", State = "Tamil Nadu", Category = "Temple/Island", Latitude = 9.2881, Longitude = 79.3129, DefaultVisitDurationMinutes = 300, Description = "Sacred island temple, one of Char Dham", IsActive = true },
                new TouristPlace { Id = 6, Name = "Thanjavur", City = "Thanjavur", State = "Tamil Nadu", Category = "Temple/Heritage", Latitude = 10.7870, Longitude = 79.1378, DefaultVisitDurationMinutes = 240, Description = "Ancient city famous for Brihadeeswarar Temple", IsActive = true },
                new TouristPlace { Id = 7, Name = "Palani", City = "Palani", State = "Tamil Nadu", Category = "Temple/Hill", Latitude = 10.4500, Longitude = 77.5167, DefaultVisitDurationMinutes = 180, Description = "Famous hill temple dedicated to Lord Murugan", IsActive = true },
                new TouristPlace { Id = 8, Name = "Ooty", City = "Ooty", State = "Tamil Nadu", Category = "Hill Station", Latitude = 11.4064, Longitude = 76.6932, DefaultVisitDurationMinutes = 480, Description = "Queen of Hill Stations with tea gardens", IsActive = true }
            };
        }

        /// <summary>
        /// Get a saved tour plan by ID
        /// </summary>
        [HttpGet("{tripId}")]
        public async Task<ActionResult<TourPlanResponse>> GetTourPlan(int tripId)
        {
            try
            {
                var tourPlan = await _tourPlannerService.GetTourPlanAsync(tripId);

                if (tourPlan == null)
                {
                    return NotFound(new { message = "Tour plan not found" });
                }

                return Ok(tourPlan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tour plan {TripId}", tripId);
                return StatusCode(500, new { message = "An error occurred while fetching the tour plan" });
            }
        }

        /// <summary>
        /// Generate and download PDF itinerary for a tour plan
        /// </summary>
        [HttpGet("{tripId}/pdf")]
        public async Task<IActionResult> DownloadPdfItinerary(int tripId)
        {
            try
            {
                var pdfBytes = await _tourPlannerService.GeneratePdfItineraryAsync(tripId);

                if (pdfBytes == null || pdfBytes.Length == 0)
                {
                    return NotFound(new { message = "PDF could not be generated" });
                }

                return File(pdfBytes, "application/pdf", $"TourItinerary_{tripId}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PDF for trip {TripId}", tripId);
                return StatusCode(500, new { message = "An error occurred while generating the PDF" });
            }
        }

        /// <summary>
        /// Quick feasibility check without full planning
        /// </summary>
        [HttpPost("feasibility-check")]
        public async Task<ActionResult<object>> CheckFeasibility([FromBody] TourPlanRequest request)
        {
            try
            {
                // Quick estimation without full route optimization
                var places = await _tourPlannerService.GetAvailablePlacesAsync();
                var requestedPlaces = places.Where(p =>
                    request.Places.Any(rp => rp.PlaceName.Equals(p.Name, StringComparison.OrdinalIgnoreCase)))
                    .ToList();

                var totalVisitTime = requestedPlaces.Sum(p => p.DefaultVisitDurationMinutes);
                var estimatedTravelTime = requestedPlaces.Count * 120; // Rough estimate: 2 hours between places
                var totalTimeNeeded = totalVisitTime + estimatedTravelTime;
                var availableTime = request.NumberOfDays * request.MaxDrivingHoursPerDay * 60;

                var feasibilityResult = new
                {
                    IsFeasible = totalTimeNeeded <= availableTime,
                    TotalTimeNeeded = totalTimeNeeded,
                    AvailableTime = availableTime,
                    UtilizationPercentage = Math.Round((double)totalTimeNeeded / availableTime * 100, 1),
                    EstimatedVisitTime = totalVisitTime,
                    EstimatedTravelTime = estimatedTravelTime,
                    ValidPlaces = requestedPlaces.Count,
                    InvalidPlaces = request.Places.Count - requestedPlaces.Count,
                    Recommendation = totalTimeNeeded > availableTime
                        ? $"Consider extending to {Math.Ceiling((double)totalTimeNeeded / (request.MaxDrivingHoursPerDay * 60))} days"
                        : "Tour appears feasible"
                };

                return Ok(feasibilityResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking feasibility");
                return StatusCode(500, new { message = "An error occurred while checking feasibility" });
            }
        }

        /// <summary>
        /// Get tour planning statistics and insights
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetPlanningStatistics()
        {
            try
            {
                var places = await _tourPlannerService.GetAvailablePlacesAsync();

                var statistics = new
                {
                    TotalPlaces = places.Count,
                    PlacesByCategory = places.GroupBy(p => p.Category)
                        .ToDictionary(g => g.Key, g => g.Count()),
                    PlacesByState = places.GroupBy(p => p.State)
                        .ToDictionary(g => g.Key, g => g.Count()),
                    AverageVisitDuration = places.Average(p => p.DefaultVisitDurationMinutes),
                    PopularCategories = places.GroupBy(p => p.Category)
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => new { Category = g.Key, Count = g.Count() })
                        .ToList(),
                    RecommendedDurations = new
                    {
                        Temple = "2-3 hours",
                        Beach = "3-4 hours",
                        HillStation = "4-6 hours",
                        Heritage = "2-4 hours",
                        City = "6-8 hours"
                    }
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics");
                return StatusCode(500, new { message = "An error occurred while fetching statistics" });
            }
        }

        /// <summary>
        /// Get route optimization suggestions for a set of places
        /// </summary>
        [HttpPost("optimize-route")]
        public async Task<ActionResult<object>> OptimizeRoute([FromBody] RouteOptimizationRequest request)
        {
            try
            {
                if (request.Places == null || !request.Places.Any())
                {
                    return BadRequest(new { message = "At least one place is required" });
                }

                // This would call the Google Maps service for route optimization
                // For now, return a simple response
                var optimizedRoute = new
                {
                    OriginalOrder = request.Places,
                    OptimizedOrder = request.Places.OrderBy(p => p).ToList(), // Placeholder
                    EstimatedSavings = new
                    {
                        DistanceKm = 50,
                        TimeMinutes = 45,
                        FuelCost = 500
                    },
                    RouteEfficiency = 85.5
                };

                return Ok(optimizedRoute);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing route");
                return StatusCode(500, new { message = "An error occurred while optimizing the route" });
            }
        }
    }

    // Additional DTOs for specific endpoints
    public class RouteOptimizationRequest
    {
        public string StartingPoint { get; set; } = "Dharmapuri";
        public List<string> Places { get; set; } = new List<string>();
        public bool ReturnToStart { get; set; } = true;
    }
}
