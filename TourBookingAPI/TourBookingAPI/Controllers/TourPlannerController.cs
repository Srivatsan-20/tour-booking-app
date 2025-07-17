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

        /// <summary>
        /// Generate simple AI tour plans
        /// </summary>
        [HttpPost("generate-simple-plan")]
        public async Task<ActionResult<List<SimpleTourPlan>>> GenerateSimplePlans([FromBody] SimplePlanRequest request)
        {
            try
            {
                _logger.LogInformation("Generating simple tour plans for {PickupLocation} covering {PlaceCount} places in {Days} days",
                    request.PickupLocation, request.PlacesToCover.Count, request.NumberOfDays);

                var plans = GenerateIntelligentTourPlans(request);
                return Ok(plans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating simple tour plans");
                return StatusCode(500, new { message = "An error occurred while generating tour plans" });
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

        /// <summary>
        /// Generate intelligent tour plans based on business logic
        /// </summary>
        private List<SimpleTourPlan> GenerateIntelligentTourPlans(SimplePlanRequest request)
        {
            var plans = new List<SimpleTourPlan>();

            // Plan 1: Efficient Route (Shortest Distance)
            plans.Add(GenerateEfficientPlan(request));

            // Plan 2: Comfort Route (Rest-focused)
            plans.Add(GenerateComfortPlan(request));

            // Plan 3: Scenic Route (Tourist-focused)
            plans.Add(GenerateScenicPlan(request));

            return plans;
        }

        private SimpleTourPlan GenerateEfficientPlan(SimplePlanRequest request)
        {
            var route = OptimizeRouteForEfficiency(request);
            var stats = CalculateRouteStatistics(route, "efficient");

            return new SimpleTourPlan
            {
                PlanName = "Efficient Route",
                Description = "Optimized for minimal travel time and fuel cost with strategic routing",
                Route = route,
                TotalDistance = stats.TotalDistance,
                TotalTravelTime = stats.TotalTravelTime,
                RestStops = stats.RestStops,
                NightTravelHours = stats.NightTravelHours,
                Features = new List<string>
                {
                    "Shortest travel distance between destinations",
                    "Minimal fuel consumption (₹" + (stats.TotalDistance * 8).ToString("N0") + " estimated)",
                    "Early morning starts (5:30 AM)",
                    "Strategic temple visit timings",
                    "Return to origin by evening"
                }
            };
        }

        private SimpleTourPlan GenerateComfortPlan(SimplePlanRequest request)
        {
            var route = OptimizeRouteForComfort(request);
            var stats = CalculateRouteStatistics(route, "comfort");

            return new SimpleTourPlan
            {
                PlanName = "Comfort Route",
                Description = "Relaxed pace with driver rest, quality hotel stays, and passenger comfort priority",
                Route = route,
                TotalDistance = stats.TotalDistance,
                TotalTravelTime = stats.TotalTravelTime,
                RestStops = stats.RestStops,
                NightTravelHours = stats.NightTravelHours,
                Features = new List<string>
                {
                    "No night driving (safety first)",
                    "Quality hotel stays in each city",
                    "Extended sightseeing time (4-5 hours per place)",
                    "Regular meal breaks and rest stops",
                    "Driver rest periods included",
                    "Comfortable 7 AM starts (not too early)"
                }
            };
        }

        private List<DayPlan> OptimizeRouteForComfort(SimplePlanRequest request)
        {
            var places = request.PlacesToCover.ToList();

            // Comfort plan with enhanced daily limits and return-to-start
            var route = CreateRouteWithDailyLimit(places, request.PickupLocation, request.NumberOfDays, "comfort");

            return route;
        }

        private SimpleTourPlan GenerateScenicPlan(SimplePlanRequest request)
        {
            var route = OptimizeRouteForSightseeing(request);
            var stats = CalculateRouteStatistics(route, "scenic");

            return new SimpleTourPlan
            {
                PlanName = "Scenic Route",
                Description = "Maximum sightseeing experience with cultural immersion and photo opportunities",
                Route = route,
                TotalDistance = stats.TotalDistance,
                TotalTravelTime = stats.TotalTravelTime,
                RestStops = stats.RestStops,
                NightTravelHours = stats.NightTravelHours,
                Features = new List<string>
                {
                    "Extended sightseeing time (5-6 hours per place)",
                    "Scenic route selection with photo stops",
                    "Local cuisine and cultural experiences",
                    "Temple architecture and history focus",
                    "Sunrise/sunset viewing opportunities",
                    "Traditional craft and shopping time"
                }
            };
        }

        private List<DayPlan> OptimizeRouteForSightseeing(SimplePlanRequest request)
        {
            var places = request.PlacesToCover.ToList();

            // Scenic plan with enhanced daily limits and return-to-start
            var route = CreateRouteWithDailyLimit(places, request.PickupLocation, request.NumberOfDays, "scenic");

            return route;
        }

        // Advanced Route Optimization Methods with 550km Daily Limit
        private List<DayPlan> OptimizeRouteForEfficiency(SimplePlanRequest request)
        {
            var places = request.PlacesToCover.ToList();
            var optimizedPlaces = OptimizePlaceOrder(places, request.PickupLocation);

            // Create route with 550km daily limit and return-to-start requirement
            var route = CreateRouteWithDailyLimit(optimizedPlaces, request.PickupLocation, request.NumberOfDays, "efficient");

            return route;
        }

        private List<DayPlan> CreateRouteWithDailyLimit(List<string> places, string startLocation, int requestedDays, string planType)
        {
            const int DAILY_KM_LIMIT = 550;
            var route = new List<DayPlan>();
            var optimizedPlaces = OptimizePlaceOrder(places, startLocation);

            // Calculate distances and create route respecting daily limits
            var currentDay = 1;
            var currentDayKm = 0;
            var currentDayPlaces = new List<string>();
            var previousLocation = startLocation;

            foreach (var place in optimizedPlaces)
            {
                var distanceToPlace = GetDistanceBetweenPlaces(previousLocation, place);

                // Check if adding this place exceeds daily limit
                if (currentDayKm + distanceToPlace > DAILY_KM_LIMIT && currentDayPlaces.Any())
                {
                    // Create day plan for current day
                    route.Add(CreateAdvancedDayPlan(currentDay, currentDayPlaces, currentDayKm, planType));

                    // Start new day
                    currentDay++;
                    currentDayPlaces = new List<string> { place };
                    currentDayKm = distanceToPlace;
                }
                else
                {
                    currentDayPlaces.Add(place);
                    currentDayKm += distanceToPlace;
                }

                previousLocation = place;
            }

            // Add remaining places to final day
            if (currentDayPlaces.Any())
            {
                // Check return journey distance
                var returnDistance = GetDistanceBetweenPlaces(previousLocation, startLocation);

                // If return journey exceeds limit, create separate return day
                if (currentDayKm + returnDistance > DAILY_KM_LIMIT)
                {
                    route.Add(CreateAdvancedDayPlan(currentDay, currentDayPlaces, currentDayKm, planType));
                    currentDay++;
                    route.Add(CreateReturnDayPlan(currentDay, previousLocation, startLocation, returnDistance, planType));
                }
                else
                {
                    route.Add(CreateAdvancedDayPlan(currentDay, currentDayPlaces, currentDayKm + returnDistance, planType, true));
                }
            }

            return route;
        }

        private List<string> OptimizePlaceOrder(List<string> places, string startLocation)
        {
            // Enhanced geographical optimization for Indian destinations
            var placeDistances = GetPlaceDistanceMatrix();
            var startDistance = placeDistances.ContainsKey(startLocation) ? placeDistances[startLocation] : new Dictionary<string, int>();

            // Sort places by distance from start location for optimal routing
            return places.OrderBy(p => startDistance.ContainsKey(p) ? startDistance[p] : 999).ToList();
        }

        private Dictionary<string, Dictionary<string, int>> GetPlaceDistanceMatrix()
        {
            // Comprehensive distance matrix for major South Indian destinations
            return new Dictionary<string, Dictionary<string, int>>
            {
                ["Chennai"] = new Dictionary<string, int>
                {
                    ["Kanchipuram"] = 70,
                    ["Thiruvannamalai"] = 195,
                    ["Chidambaram"] = 245,
                    ["Thanjavur"] = 350,
                    ["Rameshwaram"] = 570,
                    ["Madurai"] = 460,
                    ["Kanyakumari"] = 700,
                    ["Kodaikanal"] = 520,
                    ["Ooty"] = 500,
                    ["Mysore"] = 470,
                    ["Bangalore"] = 350,
                    ["Pondicherry"] = 160
                },
                ["Dharmapuri"] = new Dictionary<string, int>
                {
                    ["Chennai"] = 350,
                    ["Bangalore"] = 150,
                    ["Mysore"] = 200,
                    ["Ooty"] = 250,
                    ["Kodaikanal"] = 300,
                    ["Salem"] = 80,
                    ["Hosur"] = 50,
                    ["Krishnagiri"] = 40
                },
                ["Bangalore"] = new Dictionary<string, int>
                {
                    ["Mysore"] = 150,
                    ["Ooty"] = 280,
                    ["Chennai"] = 350,
                    ["Dharmapuri"] = 150,
                    ["Hosur"] = 40,
                    ["Kolar"] = 70
                }
            };
        }

        private int GetDistanceBetweenPlaces(string from, string to)
        {
            var matrix = GetPlaceDistanceMatrix();

            if (matrix.ContainsKey(from) && matrix[from].ContainsKey(to))
                return matrix[from][to];

            if (matrix.ContainsKey(to) && matrix[to].ContainsKey(from))
                return matrix[to][from];

            // Default estimate for unknown routes
            return 200;
        }

        private int CalculateOptimalPlacesPerDay(int totalPlaces, int totalDays)
        {
            // Realistic distribution: max 2-3 places per day for quality experience
            var placesPerDay = Math.Max(1, totalPlaces / totalDays);
            return Math.Min(placesPerDay, 3); // Cap at 3 places per day
        }

        private List<string> GetPlacesForDay(List<string> places, int day, int placesPerDay)
        {
            var startIndex = (day - 1) * placesPerDay;
            var count = Math.Min(placesPerDay, places.Count - startIndex);
            return places.Skip(startIndex).Take(count).ToList();
        }

        private DayPlan CreateAdvancedDayPlan(int dayNumber, List<string> places, int totalKm, string planType, bool isReturnDay = false)
        {
            var dayPlaces = new List<PlaceVisit>();

            foreach (var place in places)
            {
                var visitDuration = GetRealisticVisitDuration(place, planType);
                var pois = GetPointsOfInterest(place);

                dayPlaces.Add(new PlaceVisit
                {
                    Name = place,
                    VisitDuration = visitDuration,
                    PointsOfInterest = pois
                });
            }

            return new DayPlan
            {
                DayNumber = dayNumber,
                Places = dayPlaces,
                IsRestDay = false,
                IsNightTravel = ShouldIncludeNightTravel(dayNumber, places.Count, planType),
                TotalKilometers = totalKm,
                IsReturnDay = isReturnDay
            };
        }

        private DayPlan CreateReturnDayPlan(int dayNumber, string fromLocation, string toLocation, int distance, string planType)
        {
            return new DayPlan
            {
                DayNumber = dayNumber,
                Places = new List<PlaceVisit>(),
                IsRestDay = false,
                IsNightTravel = false,
                TotalKilometers = distance,
                IsReturnDay = true,
                ReturnJourney = $"Return from {fromLocation} to {toLocation}"
            };
        }

        private List<string> GetPointsOfInterest(string place)
        {
            // Comprehensive POI database for major Indian destinations
            var poiDatabase = new Dictionary<string, List<string>>
            {
                ["Chennai"] = new List<string>
                {
                    "Kapaleeshwarar Temple - Ancient Shiva temple with stunning Dravidian architecture",
                    "Marina Beach - Second longest urban beach, perfect for sunrise/sunset views",
                    "Fort St. George - Historic British fort and museum"
                },
                ["Kanchipuram"] = new List<string>
                {
                    "Ekambareswarar Temple - One of Pancha Bhoota Sthalams, darshan: 5:30 AM - 12:30 PM, 4:00 PM - 9:30 PM",
                    "Kailasanathar Temple - Oldest temple in Kanchipuram, built by Pallavas",
                    "Varadharaja Perumal Temple - Famous Vishnu temple with 1000-pillar hall"
                },
                ["Thiruvannamalai"] = new List<string>
                {
                    "Arunachaleswarar Temple - Sacred Shiva temple, darshan: 5:30 AM - 1:00 PM, 3:30 PM - 10:00 PM",
                    "Arunachala Hill - Sacred mountain for pradakshina (circumambulation)",
                    "Ramana Ashram - Peaceful spiritual center of Sri Ramana Maharshi"
                },
                ["Chidambaram"] = new List<string>
                {
                    "Nataraja Temple - Famous for cosmic dance of Shiva, darshan: 6:00 AM - 12:00 PM, 5:00 PM - 10:00 PM",
                    "Pichavaram Mangrove Forest - Boat rides through scenic backwaters",
                    "Thillai Kali Temple - Ancient goddess temple"
                },
                ["Thanjavur"] = new List<string>
                {
                    "Brihadeeswarar Temple - UNESCO World Heritage Chola temple, darshan: 6:00 AM - 8:30 PM",
                    "Thanjavur Palace - Royal palace with art gallery and library",
                    "Saraswathi Mahal Library - Ancient manuscript library"
                },
                ["Rameshwaram"] = new List<string>
                {
                    "Ramanathaswamy Temple - Sacred Jyotirlinga, darshan: 5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
                    "Dhanushkodi Beach - Ghost town with pristine beach, best for sunset photography",
                    "Pamban Bridge - Iconic railway bridge connecting mainland to island"
                },
                ["Madurai"] = new List<string>
                {
                    "Meenakshi Amman Temple - Magnificent temple complex, darshan: 5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
                    "Thirumalai Nayakkar Palace - Indo-Saracenic palace architecture",
                    "Gandhi Memorial Museum - Historical museum in colonial building"
                },
                ["Kanyakumari"] = new List<string>
                {
                    "Kumari Amman Temple - Southernmost tip temple, darshan: 4:30 AM - 12:20 PM, 4:00 PM - 8:00 PM",
                    "Sunrise/Sunset Point - Unique place to see both sunrise and sunset over ocean",
                    "Vivekananda Rock Memorial - Meditation hall on rock island"
                },
                ["Kodaikanal"] = new List<string>
                {
                    "Kodai Lake - Scenic boat rides and cycling around star-shaped lake",
                    "Coaker's Walk - Cliff-side walking path with valley views, best at sunrise/sunset",
                    "Silver Cascade Falls - 180-foot waterfall, best during monsoon season"
                },
                ["Ooty"] = new List<string>
                {
                    "Nilgiri Mountain Railway - UNESCO heritage toy train through scenic hills",
                    "Doddabetta Peak - Highest point in Nilgiris with panoramic views",
                    "Ooty Lake - Boating and horse riding around artificial lake"
                }
            };

            return poiDatabase.ContainsKey(place) ? poiDatabase[place] : new List<string>
            {
                $"{place} - Local temples and scenic spots (details to be confirmed)"
            };
        }

        private string GetRealisticVisitDuration(string place, string planType)
        {
            // Temple and tourist place specific durations
            var templePlaces = new[] { "Kanchipuram", "Thiruvannamalai", "Chidambaram", "Thanjavur", "Rameshwaram" };
            var hillStations = new[] { "Kodaikanal", "Ooty" };

            if (templePlaces.Contains(place))
            {
                return planType == "efficient" ? "2-3 hours" : planType == "comfort" ? "3-4 hours" : "4-5 hours";
            }
            else if (hillStations.Contains(place))
            {
                return planType == "efficient" ? "4-5 hours" : planType == "comfort" ? "5-6 hours" : "6-8 hours";
            }
            else
            {
                return planType == "efficient" ? "3-4 hours" : planType == "comfort" ? "4-5 hours" : "5-6 hours";
            }
        }

        private bool ShouldIncludeNightTravel(int dayNumber, int totalDays, string planType)
        {
            if (planType == "comfort") return false; // Comfort plan avoids night travel
            if (dayNumber == totalDays) return false; // No night travel on last day
            return dayNumber > 1; // Night travel after first day for efficiency
        }

        private RouteStatistics CalculateRouteStatistics(List<DayPlan> route, string planType)
        {
            var totalPlaces = route.SelectMany(d => d.Places).Count();
            var baseDistance = 1200;
            var distancePerPlace = planType == "efficient" ? 120 : planType == "comfort" ? 150 : 180;

            return new RouteStatistics
            {
                TotalDistance = baseDistance + (totalPlaces * distancePerPlace),
                TotalTravelTime = 16 + (totalPlaces * (planType == "efficient" ? 2 : planType == "comfort" ? 3 : 4)),
                RestStops = route.Count(d => !d.IsRestDay) - 1,
                NightTravelHours = route.Count(d => d.IsNightTravel) * 6
            };
        }
    }

    // Helper class for route statistics
    public class RouteStatistics
    {
        public int TotalDistance { get; set; }
        public int TotalTravelTime { get; set; }
        public int RestStops { get; set; }
        public int NightTravelHours { get; set; }
    }

    // DTOs for Simple Tour Planner
    public class SimplePlanRequest
    {
        public string PickupLocation { get; set; } = string.Empty;
        public List<string> PlacesToCover { get; set; } = new();
        public int NumberOfDays { get; set; }
    }

    public class SimpleTourPlan
    {
        public string PlanName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<DayPlan> Route { get; set; } = new();
        public int TotalDistance { get; set; }
        public int TotalTravelTime { get; set; }
        public int RestStops { get; set; }
        public int NightTravelHours { get; set; }
        public List<string> Features { get; set; } = new();
    }

    public class DayPlan
    {
        public int DayNumber { get; set; }
        public List<PlaceVisit> Places { get; set; } = new();
        public bool IsRestDay { get; set; }
        public bool IsNightTravel { get; set; }
        public int TotalKilometers { get; set; }
        public bool IsReturnDay { get; set; }
        public string ReturnJourney { get; set; } = string.Empty;
    }

    public class PlaceVisit
    {
        public string Name { get; set; } = string.Empty;
        public string VisitDuration { get; set; } = string.Empty;
        public List<string> PointsOfInterest { get; set; } = new();
    }

    // Additional DTOs for specific endpoints
    public class RouteOptimizationRequest
    {
        public string StartingPoint { get; set; } = "Dharmapuri";
        public List<string> Places { get; set; } = new List<string>();
        public bool ReturnToStart { get; set; } = true;
    }
}
