using System.Text.Json;
using TourBookingApp.Models;

namespace TourBookingApp.Services
{
    public interface IGoogleMapsService
    {
        Task<DistanceMatrixResult> GetDistanceMatrixAsync(List<string> origins, List<string> destinations);
        Task<GeocodingResult> GeocodeAddressAsync(string address);
        Task<RouteOptimizationResult> OptimizeRouteAsync(string start, List<string> waypoints, string end);
    }

    public class GoogleMapsService : IGoogleMapsService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GoogleMapsService> _logger;
        private readonly string _apiKey;

        public GoogleMapsService(HttpClient httpClient, IConfiguration configuration, ILogger<GoogleMapsService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _apiKey = _configuration["GoogleMaps:ApiKey"] ?? throw new InvalidOperationException("Google Maps API key not configured");
        }

        public async Task<DistanceMatrixResult> GetDistanceMatrixAsync(List<string> origins, List<string> destinations)
        {
            try
            {
                var originsParam = string.Join("|", origins.Select(Uri.EscapeDataString));
                var destinationsParam = string.Join("|", destinations.Select(Uri.EscapeDataString));
                
                var url = $"https://maps.googleapis.com/maps/api/distancematrix/json" +
                         $"?origins={originsParam}" +
                         $"&destinations={destinationsParam}" +
                         $"&mode=driving" +
                         $"&units=metric" +
                         $"&avoid=tolls" +
                         $"&key={_apiKey}";

                _logger.LogInformation("Calling Google Distance Matrix API for {OriginCount} origins and {DestinationCount} destinations", 
                    origins.Count, destinations.Count);

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var jsonContent = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<GoogleDistanceMatrixResponse>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
                });

                if (apiResponse?.Status != "OK")
                {
                    _logger.LogWarning("Google Distance Matrix API returned status: {Status}", apiResponse?.Status);
                    return new DistanceMatrixResult { IsSuccess = false, ErrorMessage = apiResponse?.Status ?? "Unknown error" };
                }

                var result = new DistanceMatrixResult
                {
                    IsSuccess = true,
                    Origins = origins,
                    Destinations = destinations,
                    DistanceMatrix = new int[origins.Count, destinations.Count],
                    DurationMatrix = new int[origins.Count, destinations.Count]
                };

                for (int i = 0; i < apiResponse.Rows.Count; i++)
                {
                    for (int j = 0; j < apiResponse.Rows[i].Elements.Count; j++)
                    {
                        var element = apiResponse.Rows[i].Elements[j];
                        if (element.Status == "OK")
                        {
                            result.DistanceMatrix[i, j] = element.Distance.Value;
                            result.DurationMatrix[i, j] = element.Duration.Value;
                        }
                        else
                        {
                            result.DistanceMatrix[i, j] = int.MaxValue;
                            result.DurationMatrix[i, j] = int.MaxValue;
                        }
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Google Distance Matrix API");
                return new DistanceMatrixResult { IsSuccess = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<GeocodingResult> GeocodeAddressAsync(string address)
        {
            try
            {
                var url = $"https://maps.googleapis.com/maps/api/geocode/json" +
                         $"?address={Uri.EscapeDataString(address)}" +
                         $"&key={_apiKey}";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var jsonContent = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<GoogleGeocodingResponse>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
                });

                if (apiResponse?.Status != "OK" || !apiResponse.Results.Any())
                {
                    return new GeocodingResult { IsSuccess = false, ErrorMessage = "Address not found" };
                }

                var location = apiResponse.Results.First().Geometry.Location;
                return new GeocodingResult
                {
                    IsSuccess = true,
                    Latitude = location.Lat,
                    Longitude = location.Lng,
                    FormattedAddress = apiResponse.Results.First().FormattedAddress
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error geocoding address: {Address}", address);
                return new GeocodingResult { IsSuccess = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<RouteOptimizationResult> OptimizeRouteAsync(string start, List<string> waypoints, string end)
        {
            try
            {
                // For now, use a simple greedy approach
                // In production, you might want to use Google's Directions API with waypoint optimization
                // or implement a more sophisticated algorithm like TSP solver

                var allLocations = new List<string> { start };
                allLocations.AddRange(waypoints);
                if (end != start) allLocations.Add(end);

                var distanceMatrix = await GetDistanceMatrixAsync(allLocations, allLocations);
                if (!distanceMatrix.IsSuccess)
                {
                    return new RouteOptimizationResult { IsSuccess = false, ErrorMessage = distanceMatrix.ErrorMessage };
                }

                // Simple greedy algorithm for route optimization
                var optimizedRoute = OptimizeRouteGreedy(allLocations, distanceMatrix, start, end);

                return new RouteOptimizationResult
                {
                    IsSuccess = true,
                    OptimizedRoute = optimizedRoute,
                    TotalDistanceKm = CalculateTotalDistance(optimizedRoute, distanceMatrix, allLocations),
                    TotalDurationMinutes = CalculateTotalDuration(optimizedRoute, distanceMatrix, allLocations)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error optimizing route");
                return new RouteOptimizationResult { IsSuccess = false, ErrorMessage = ex.Message };
            }
        }

        private List<string> OptimizeRouteGreedy(List<string> locations, DistanceMatrixResult matrix, string start, string end)
        {
            var route = new List<string> { start };
            var unvisited = locations.Where(l => l != start && l != end).ToList();
            var currentLocation = start;

            while (unvisited.Any())
            {
                var currentIndex = locations.IndexOf(currentLocation);
                var nearestLocation = unvisited
                    .OrderBy(loc => matrix.DurationMatrix[currentIndex, locations.IndexOf(loc)])
                    .First();

                route.Add(nearestLocation);
                unvisited.Remove(nearestLocation);
                currentLocation = nearestLocation;
            }

            if (end != start)
            {
                route.Add(end);
            }

            return route;
        }

        private int CalculateTotalDistance(List<string> route, DistanceMatrixResult matrix, List<string> allLocations)
        {
            int totalDistance = 0;
            for (int i = 0; i < route.Count - 1; i++)
            {
                var fromIndex = allLocations.IndexOf(route[i]);
                var toIndex = allLocations.IndexOf(route[i + 1]);
                totalDistance += matrix.DistanceMatrix[fromIndex, toIndex];
            }
            return totalDistance / 1000; // Convert to kilometers
        }

        private int CalculateTotalDuration(List<string> route, DistanceMatrixResult matrix, List<string> allLocations)
        {
            int totalDuration = 0;
            for (int i = 0; i < route.Count - 1; i++)
            {
                var fromIndex = allLocations.IndexOf(route[i]);
                var toIndex = allLocations.IndexOf(route[i + 1]);
                totalDuration += matrix.DurationMatrix[fromIndex, toIndex];
            }
            return totalDuration / 60; // Convert to minutes
        }
    }

    // Response models for Google APIs
    public class GoogleDistanceMatrixResponse
    {
        public string Status { get; set; }
        public List<DistanceMatrixRow> Rows { get; set; } = new List<DistanceMatrixRow>();
    }

    public class DistanceMatrixRow
    {
        public List<DistanceMatrixElement> Elements { get; set; } = new List<DistanceMatrixElement>();
    }

    public class DistanceMatrixElement
    {
        public string Status { get; set; }
        public DistanceValue Distance { get; set; }
        public DurationValue Duration { get; set; }
    }

    public class DistanceValue
    {
        public string Text { get; set; }
        public int Value { get; set; }
    }

    public class DurationValue
    {
        public string Text { get; set; }
        public int Value { get; set; }
    }

    public class GoogleGeocodingResponse
    {
        public string Status { get; set; }
        public List<GeocodingResult> Results { get; set; } = new List<GeocodingResult>();
    }

    public class GeocodeResult
    {
        public string FormattedAddress { get; set; }
        public Geometry Geometry { get; set; }
    }

    public class Geometry
    {
        public Location Location { get; set; }
    }

    public class Location
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

    // Service result models
    public class DistanceMatrixResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public List<string> Origins { get; set; } = new List<string>();
        public List<string> Destinations { get; set; } = new List<string>();
        public int[,] DistanceMatrix { get; set; }
        public int[,] DurationMatrix { get; set; }
    }

    public class GeocodingResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string FormattedAddress { get; set; }
    }

    public class RouteOptimizationResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public List<string> OptimizedRoute { get; set; } = new List<string>();
        public int TotalDistanceKm { get; set; }
        public int TotalDurationMinutes { get; set; }
    }
}
