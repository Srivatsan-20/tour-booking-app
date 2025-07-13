using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Services
{
    public interface ITourPlannerService
    {
        Task<TourPlanResponse> CreateTourPlanAsync(TourPlanRequest request);
        Task<TourPlanResponse> GetTourPlanAsync(int tripId);
        Task<List<TouristPlace>> GetAvailablePlacesAsync();
        Task<bool> SaveTourPlanAsync(TourPlanResponse tourPlan, string userId);
        Task<byte[]> GeneratePdfItineraryAsync(int tripId);
    }

    public class TourPlannerService : ITourPlannerService
    {
        private readonly AppDbContext _context;
        private readonly IGoogleMapsService _mapsService;
        private readonly ILogger<TourPlannerService> _logger;

        public TourPlannerService(
            AppDbContext context,
            IGoogleMapsService mapsService,
            ILogger<TourPlannerService> logger)
        {
            _context = context;
            _mapsService = mapsService;
            _logger = logger;
        }

        public async Task<TourPlanResponse> CreateTourPlanAsync(TourPlanRequest request)
        {
            try
            {
                _logger.LogInformation("Creating tour plan for {PlaceCount} places over {Days} days",
                    request.Places.Count, request.NumberOfDays);

                // Validate and geocode starting point
                var startGeocode = await _mapsService.GeocodeAddressAsync(request.StartingPoint);
                if (!startGeocode.IsSuccess)
                {
                    return new TourPlanResponse
                    {
                        IsFeasible = false,
                        Warnings = new List<string> { $"Could not find starting point: {request.StartingPoint}" }
                    };
                }

                // Get tourist places from database and validate requested places
                var availablePlaces = await GetAvailablePlacesAsync();
                var validPlaces = new List<(TouristPlace place, TourPlaceRequest request)>();
                var invalidPlaces = new List<string>();

                foreach (var placeRequest in request.Places)
                {
                    var place = availablePlaces.FirstOrDefault(p =>
                        p.Name.Equals(placeRequest.PlaceName, StringComparison.OrdinalIgnoreCase) ||
                        p.City.Equals(placeRequest.PlaceName, StringComparison.OrdinalIgnoreCase));

                    if (place != null)
                    {
                        validPlaces.Add((place, placeRequest));
                    }
                    else
                    {
                        invalidPlaces.Add(placeRequest.PlaceName);
                    }
                }

                if (!validPlaces.Any())
                {
                    return new TourPlanResponse
                    {
                        IsFeasible = false,
                        Warnings = new List<string> { "No valid tourist places found in the request" }
                    };
                }

                // Calculate optimal route
                var locations = new List<string> { request.StartingPoint };
                locations.AddRange(validPlaces.Select(vp => vp.place.Name));

                var routeOptimization = await _mapsService.OptimizeRouteAsync(
                    request.StartingPoint,
                    validPlaces.Select(vp => vp.place.Name).ToList(),
                    request.StartingPoint
                );

                if (!routeOptimization.IsSuccess)
                {
                    return new TourPlanResponse
                    {
                        IsFeasible = false,
                        Warnings = new List<string> { $"Could not calculate route: {routeOptimization.ErrorMessage}" }
                    };
                }

                // Generate day-wise itinerary with time constraints
                var itineraryResult = await GenerateItineraryAsync(
                    request,
                    validPlaces,
                    routeOptimization,
                    startGeocode
                );

                return itineraryResult;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating tour plan");
                return new TourPlanResponse
                {
                    IsFeasible = false,
                    Warnings = new List<string> { "An error occurred while creating the tour plan" }
                };
            }
        }

        public async Task<List<TouristPlace>> GetAvailablePlacesAsync()
        {
            try
            {
                return await _context.TouristPlaces
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not access TouristPlaces table, returning empty list");
                return new List<TouristPlace>();
            }
        }

        public async Task<TourPlanResponse> GetTourPlanAsync(int tripId)
        {
            var trip = await _context.PlannedTrips
                .Include(t => t.TripDays)
                    .ThenInclude(d => d.TripStops)
                        .ThenInclude(s => s.TouristPlace)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return null;

            // Convert database model to response model
            var response = new TourPlanResponse
            {
                TripId = trip.Id,
                TripName = trip.TripName,
                IsFeasible = trip.IsFeasible,
                TotalDays = trip.NumberOfDays,
                TotalDistanceKm = trip.TotalDistanceKm,
                TotalDrivingHours = trip.TotalDrivingMinutes / 60,
                EstimatedFuelCost = trip.EstimatedFuelCost,
                DayItineraries = trip.TripDays.OrderBy(d => d.DayNumber).Select(d => new DayItinerary
                {
                    DayNumber = d.DayNumber,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime,
                    DrivingHours = d.TotalDrivingMinutes / 60,
                    TotalDistanceKm = d.TotalDistanceKm,
                    Summary = d.DaySummary,
                    Stops = d.TripStops.OrderBy(s => s.SequenceNumber).Select(s => new ItineraryStop
                    {
                        SequenceNumber = s.SequenceNumber,
                        StopType = s.StopType,
                        PlaceName = s.PlaceName,
                        StartTime = s.StartTime,
                        EndTime = s.EndTime,
                        DurationMinutes = s.StopType == "Visit" ? s.VisitDurationMinutes : s.TravelTimeMinutes,
                        DistanceKm = s.DistanceKm,
                        FromLocation = s.FromLocation,
                        ToLocation = s.ToLocation,
                        Notes = s.Notes
                    }).ToList()
                }).ToList()
            };

            return response;
        }

        public async Task<bool> SaveTourPlanAsync(TourPlanResponse tourPlan, string userId)
        {
            try
            {
                var plannedTrip = new PlannedTrip
                {
                    TripName = tourPlan.TripName,
                    StartingPoint = "Dharmapuri", // Default from request
                    NumberOfDays = tourPlan.TotalDays,
                    TotalDistanceKm = tourPlan.TotalDistanceKm,
                    TotalDrivingMinutes = tourPlan.TotalDrivingHours * 60,
                    EstimatedFuelCost = tourPlan.EstimatedFuelCost,
                    IsFeasible = tourPlan.IsFeasible,
                    CreatedBy = userId,
                    WarningsAndNotes = string.Join("; ", tourPlan.Warnings)
                };

                _context.PlannedTrips.Add(plannedTrip);
                await _context.SaveChangesAsync();

                // Save day itineraries
                foreach (var dayItinerary in tourPlan.DayItineraries)
                {
                    var tripDay = new TripDay
                    {
                        PlannedTripId = plannedTrip.Id,
                        DayNumber = dayItinerary.DayNumber,
                        StartTime = dayItinerary.StartTime,
                        EndTime = dayItinerary.EndTime,
                        TotalDrivingMinutes = dayItinerary.DrivingHours * 60,
                        TotalDistanceKm = dayItinerary.TotalDistanceKm,
                        DaySummary = dayItinerary.Summary
                    };

                    _context.TripDays.Add(tripDay);
                    await _context.SaveChangesAsync();

                    // Save stops
                    foreach (var stop in dayItinerary.Stops)
                    {
                        var tripStop = new TripStop
                        {
                            TripDayId = tripDay.Id,
                            SequenceNumber = stop.SequenceNumber,
                            StopType = stop.StopType,
                            PlaceName = stop.PlaceName,
                            StartTime = stop.StartTime,
                            EndTime = stop.EndTime,
                            FromLocation = stop.FromLocation,
                            ToLocation = stop.ToLocation,
                            Notes = stop.Notes
                        };

                        if (stop.StopType == "Visit")
                        {
                            tripStop.VisitDurationMinutes = stop.DurationMinutes;
                        }
                        else
                        {
                            tripStop.TravelTimeMinutes = stop.DurationMinutes;
                            tripStop.DistanceKm = stop.DistanceKm ?? 0;
                        }

                        _context.TripStops.Add(tripStop);
                    }
                }

                await _context.SaveChangesAsync();
                tourPlan.TripId = plannedTrip.Id;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving tour plan");
                return false;
            }
        }

        public async Task<byte[]> GeneratePdfItineraryAsync(int tripId)
        {
            // Placeholder for PDF generation
            // In a real implementation, you would use a library like iTextSharp
            // to generate a professional PDF itinerary
            return new byte[0];
        }

        private async Task<TourPlanResponse> GenerateItineraryAsync(
            TourPlanRequest request,
            List<(TouristPlace place, TourPlaceRequest request)> validPlaces,
            RouteOptimizationResult routeOptimization,
            GeocodingResult startLocation)
        {
            var response = new TourPlanResponse
            {
                TripName = request.TripName ?? $"Tour from {request.StartingPoint}",
                TotalDays = request.NumberOfDays,
                IsFeasible = true,
                Warnings = new List<string>(),
                ExcludedPlaces = new List<string>()
            };

            var maxDrivingMinutesPerDay = request.MaxDrivingHoursPerDay * 60;
            var returnDeadline = request.ReturnDeadline ?? DateTime.Today.AddDays(request.NumberOfDays).AddHours(1); // 1:00 AM

            // Get distance matrix for all locations
            var allLocations = new List<string> { request.StartingPoint };
            allLocations.AddRange(validPlaces.Select(vp => vp.place.Name));

            var distanceMatrix = await _mapsService.GetDistanceMatrixAsync(allLocations, allLocations);
            if (!distanceMatrix.IsSuccess)
            {
                response.IsFeasible = false;
                response.Warnings.Add("Could not calculate distances between locations");
                return response;
            }

            // Generate day-wise itinerary
            var currentTime = DateTime.Today.AddHours(6); // Start at 6:00 AM
            var currentLocation = request.StartingPoint;
            var currentLocationIndex = 0;
            var remainingPlaces = validPlaces.OrderBy(vp => vp.request.Priority).ToList();
            var dayItineraries = new List<DayItinerary>();

            for (int day = 1; day <= request.NumberOfDays; day++)
            {
                var dayItinerary = new DayItinerary
                {
                    DayNumber = day,
                    StartTime = currentTime,
                    Stops = new List<ItineraryStop>()
                };

                var dayStartTime = currentTime;
                var dailyDrivingMinutes = 0;
                var dailyDistanceKm = 0;
                var placesVisitedToday = 0;

                // Plan stops for this day
                while (remainingPlaces.Any() && dailyDrivingMinutes < maxDrivingMinutesPerDay)
                {
                    // Find the nearest unvisited place
                    var nearestPlace = FindNearestPlace(currentLocationIndex, remainingPlaces, distanceMatrix, allLocations);
                    if (nearestPlace == null) break;

                    var placeIndex = allLocations.IndexOf(nearestPlace.Value.place.Name);
                    var travelTimeMinutes = distanceMatrix.DurationMatrix[currentLocationIndex, placeIndex] / 60;
                    var travelDistanceKm = distanceMatrix.DistanceMatrix[currentLocationIndex, placeIndex] / 1000;
                    var visitDurationMinutes = nearestPlace.Value.request.CustomVisitDurationMinutes ?? nearestPlace.Value.place.DefaultVisitDurationMinutes;

                    // Check if we can fit this place in the current day
                    var totalTimeNeeded = travelTimeMinutes + visitDurationMinutes;

                    // For the last day, check if we can return to base by deadline
                    if (day == request.NumberOfDays)
                    {
                        var returnTravelTime = distanceMatrix.DurationMatrix[placeIndex, 0] / 60; // Return to start
                        totalTimeNeeded += returnTravelTime;

                        if (currentTime.AddMinutes(totalTimeNeeded) > returnDeadline)
                        {
                            response.ExcludedPlaces.Add($"{nearestPlace.Value.place.Name} - Cannot return to base by deadline");
                            remainingPlaces.Remove(nearestPlace.Value);
                            continue;
                        }
                    }

                    // Check daily driving limit
                    if (dailyDrivingMinutes + travelTimeMinutes > maxDrivingMinutesPerDay)
                    {
                        break; // Move to next day
                    }

                    // Check if we have enough time in the day (assuming 18-hour day max)
                    if (currentTime.AddMinutes(totalTimeNeeded).Hour >= 22)
                    {
                        break; // Too late in the day
                    }

                    // Add travel stop
                    if (travelTimeMinutes > 0)
                    {
                        dayItinerary.Stops.Add(new ItineraryStop
                        {
                            SequenceNumber = dayItinerary.Stops.Count + 1,
                            StopType = "Travel",
                            FromLocation = currentLocation,
                            ToLocation = nearestPlace.Value.place.Name,
                            StartTime = currentTime,
                            EndTime = currentTime.AddMinutes(travelTimeMinutes),
                            DurationMinutes = travelTimeMinutes,
                            DistanceKm = travelDistanceKm,
                            Notes = $"Drive from {currentLocation} to {nearestPlace.Value.place.Name}"
                        });

                        currentTime = currentTime.AddMinutes(travelTimeMinutes);
                        dailyDrivingMinutes += travelTimeMinutes;
                        dailyDistanceKm += travelDistanceKm;
                    }

                    // Add visit stop
                    dayItinerary.Stops.Add(new ItineraryStop
                    {
                        SequenceNumber = dayItinerary.Stops.Count + 1,
                        StopType = "Visit",
                        PlaceName = nearestPlace.Value.place.Name,
                        StartTime = currentTime,
                        EndTime = currentTime.AddMinutes(visitDurationMinutes),
                        DurationMinutes = visitDurationMinutes,
                        Notes = nearestPlace.Value.place.Description ?? $"Visit {nearestPlace.Value.place.Name}"
                    });

                    currentTime = currentTime.AddMinutes(visitDurationMinutes);
                    currentLocation = nearestPlace.Value.place.Name;
                    currentLocationIndex = placeIndex;
                    remainingPlaces.Remove(nearestPlace.Value);
                    placesVisitedToday++;
                }

                // If it's the last day, add return journey
                if (day == request.NumberOfDays && currentLocation != request.StartingPoint)
                {
                    var returnTravelTime = distanceMatrix.DurationMatrix[currentLocationIndex, 0] / 60;
                    var returnDistance = distanceMatrix.DistanceMatrix[currentLocationIndex, 0] / 1000;

                    dayItinerary.Stops.Add(new ItineraryStop
                    {
                        SequenceNumber = dayItinerary.Stops.Count + 1,
                        StopType = "Travel",
                        FromLocation = currentLocation,
                        ToLocation = request.StartingPoint,
                        StartTime = currentTime,
                        EndTime = currentTime.AddMinutes(returnTravelTime),
                        DurationMinutes = returnTravelTime,
                        DistanceKm = returnDistance,
                        Notes = $"Return to {request.StartingPoint}"
                    });

                    currentTime = currentTime.AddMinutes(returnTravelTime);
                    dailyDrivingMinutes += returnTravelTime;
                    dailyDistanceKm += returnDistance;
                }

                dayItinerary.EndTime = currentTime;
                dayItinerary.DrivingHours = dailyDrivingMinutes / 60;
                dayItinerary.TotalDistanceKm = dailyDistanceKm;
                dayItinerary.Summary = $"{placesVisitedToday} places, {dailyDrivingMinutes / 60}h driving, {dailyDistanceKm}km";

                dayItineraries.Add(dayItinerary);

                // Prepare for next day
                if (day < request.NumberOfDays)
                {
                    currentTime = DateTime.Today.AddDays(day).AddHours(6); // Next day at 6:00 AM
                    // Stay at current location for next day start
                }
            }

            // Add excluded places
            foreach (var excluded in remainingPlaces)
            {
                response.ExcludedPlaces.Add($"{excluded.place.Name} - Not enough time");
            }

            response.DayItineraries = dayItineraries;
            response.TotalDistanceKm = dayItineraries.Sum(d => d.TotalDistanceKm);
            response.TotalDrivingHours = dayItineraries.Sum(d => d.DrivingHours);
            response.EstimatedFuelCost = CalculateFuelCost(response.TotalDistanceKm);

            // Generate summary
            response.Summary = new TripSummary
            {
                TotalPlaces = validPlaces.Count,
                PlacesVisited = validPlaces.Count - remainingPlaces.Count,
                PlacesExcluded = remainingPlaces.Count,
                TotalDrivingHours = response.TotalDrivingHours,
                TotalVisitingHours = dayItineraries.SelectMany(d => d.Stops.Where(s => s.StopType == "Visit")).Sum(s => s.DurationMinutes) / 60,
                ReturnTime = dayItineraries.Last().EndTime,
                MeetsReturnDeadline = dayItineraries.Last().EndTime <= returnDeadline,
                EfficiencyPercentage = Math.Round((decimal)(validPlaces.Count - remainingPlaces.Count) / validPlaces.Count * 100, 1)
            };

            // Add warnings if needed
            if (remainingPlaces.Any())
            {
                response.Warnings.Add($"{remainingPlaces.Count} places could not be included due to time constraints");
            }

            if (!response.Summary.MeetsReturnDeadline)
            {
                response.Warnings.Add("Return time exceeds the 1:00 AM deadline");
            }

            return response;
        }

        private (TouristPlace place, TourPlaceRequest request)? FindNearestPlace(
            int currentLocationIndex,
            List<(TouristPlace place, TourPlaceRequest request)> remainingPlaces,
            DistanceMatrixResult distanceMatrix,
            List<string> allLocations)
        {
            return remainingPlaces
                .OrderBy(p => distanceMatrix.DurationMatrix[currentLocationIndex, allLocations.IndexOf(p.place.Name)])
                .ThenBy(p => p.request.Priority)
                .FirstOrDefault();
        }

        private decimal CalculateFuelCost(int totalDistanceKm)
        {
            // Assume 8 km/liter fuel efficiency and ₹100 per liter
            var fuelNeeded = (decimal)totalDistanceKm / 8;
            return fuelNeeded * 100;
        }
    }
}
