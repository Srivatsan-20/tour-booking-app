using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Models;

namespace TourBookingAPI.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Seed Bus Amenities
            if (!await context.BusAmenities.AnyAsync())
            {
                var amenities = new List<BusAmenity>
                {
                    new BusAmenity { Name = "Air Conditioning", Description = "Climate controlled environment", Icon = "fas fa-snowflake", IsActive = true },
                    new BusAmenity { Name = "WiFi", Description = "Free wireless internet", Icon = "fas fa-wifi", IsActive = true },
                    new BusAmenity { Name = "Entertainment System", Description = "TV and music system", Icon = "fas fa-tv", IsActive = true },
                    new BusAmenity { Name = "Charging Points", Description = "USB and power outlets", Icon = "fas fa-plug", IsActive = true },
                    new BusAmenity { Name = "Reading Lights", Description = "Individual reading lights", Icon = "fas fa-lightbulb", IsActive = true },
                    new BusAmenity { Name = "Reclining Seats", Description = "Comfortable reclining seats", Icon = "fas fa-chair", IsActive = true },
                    new BusAmenity { Name = "First Aid Kit", Description = "Emergency medical supplies", Icon = "fas fa-first-aid", IsActive = true },
                    new BusAmenity { Name = "GPS Tracking", Description = "Real-time location tracking", Icon = "fas fa-map-marker-alt", IsActive = true },
                    new BusAmenity { Name = "CCTV", Description = "Security cameras", Icon = "fas fa-video", IsActive = true },
                    new BusAmenity { Name = "Fire Extinguisher", Description = "Safety equipment", Icon = "fas fa-fire-extinguisher", IsActive = true }
                };

                await context.BusAmenities.AddRangeAsync(amenities);
                await context.SaveChangesAsync();
            }

            // Seed Bus Photos (placeholder paths)
            if (!await context.BusPhotos.AnyAsync())
            {
                var buses = await context.Buses.ToListAsync();
                if (buses.Any())
                {
                    var photos = new List<BusPhoto>();

                    foreach (var bus in buses.Take(6)) // Add photos for first 6 buses
                    {
                        photos.AddRange(new List<BusPhoto>
                    {
                        new BusPhoto
                        {
                            BusId = bus.Id,
                            FileName = $"bus_{bus.Id}_1.jpg",
                            FilePath = $"/images/bus-{bus.Id}-1.jpg",
                            Caption = "Exterior view",
                            IsPrimary = true,
                            DisplayOrder = 1
                        },
                        new BusPhoto
                        {
                            BusId = bus.Id,
                            FileName = $"bus_{bus.Id}_2.jpg",
                            FilePath = $"/images/bus-{bus.Id}-2.jpg",
                            Caption = "Interior view",
                            IsPrimary = false,
                            DisplayOrder = 2
                        },
                        new BusPhoto
                        {
                            BusId = bus.Id,
                            FileName = $"bus_{bus.Id}_3.jpg",
                            FilePath = $"/images/bus-{bus.Id}-3.jpg",
                            Caption = "Seating arrangement",
                            IsPrimary = false,
                            DisplayOrder = 3
                        }
                    });
                    }

                    await context.BusPhotos.AddRangeAsync(photos);
                    await context.SaveChangesAsync();
                }
            }

            // Seed Bus Amenity Mappings
            if (!await context.BusAmenityMappings.AnyAsync())
            {
                var buses = await context.Buses.ToListAsync();
                var amenities = await context.BusAmenities.ToListAsync();

                if (buses.Any() && amenities.Any())
                {
                    var mappings = new List<BusAmenityMapping>();

                    foreach (var bus in buses)
                    {
                        // Add different amenities based on bus type
                        var busAmenities = new List<int>();

                        if (bus.BusType.Contains("AC"))
                        {
                            busAmenities.AddRange(new[] { 1, 4, 5, 7, 8, 9, 10 }); // AC, Charging, Reading Lights, First Aid, GPS, CCTV, Fire Extinguisher

                            if (bus.BusType.Contains("Luxury") || bus.BusType.Contains("Premium"))
                            {
                                busAmenities.AddRange(new[] { 2, 3, 6 }); // WiFi, Entertainment, Reclining Seats
                            }
                        }
                        else
                        {
                            busAmenities.AddRange(new[] { 4, 5, 7, 8, 10 }); // Charging, Reading Lights, First Aid, GPS, Fire Extinguisher
                        }

                        foreach (var amenityId in busAmenities.Distinct())
                        {
                            if (amenityId <= amenities.Count)
                            {
                                mappings.Add(new BusAmenityMapping
                                {
                                    BusId = bus.Id,
                                    BusAmenityId = amenityId
                                });
                            }
                        }
                    }

                    await context.BusAmenityMappings.AddRangeAsync(mappings);
                    await context.SaveChangesAsync();
                }
            }

            // Seed Sample Customer Reviews
            if (!await context.CustomerAccounts.AnyAsync())
            {
                var customers = new List<CustomerAccount>
                {
                    new CustomerAccount
                    {
                        Name = "Rajesh Kumar",
                        Email = "rajesh@example.com",
                        Phone = "9876543210",
                        City = "Chennai",
                        State = "Tamil Nadu",
                        PasswordHash = "dummy_hash",
                        PasswordSalt = "dummy_salt",
                        IsVerified = true
                    },
                    new CustomerAccount
                    {
                        Name = "Priya Sharma",
                        Email = "priya@example.com",
                        Phone = "9876543211",
                        City = "Bangalore",
                        State = "Karnataka",
                        PasswordHash = "dummy_hash",
                        PasswordSalt = "dummy_salt",
                        IsVerified = true
                    },
                    new CustomerAccount
                    {
                        Name = "Arun Patel",
                        Email = "arun@example.com",
                        Phone = "9876543212",
                        City = "Coimbatore",
                        State = "Tamil Nadu",
                        PasswordHash = "dummy_hash",
                        PasswordSalt = "dummy_salt",
                        IsVerified = true
                    }
                };

                await context.CustomerAccounts.AddRangeAsync(customers);
                await context.SaveChangesAsync();

                // Reload customers to get their IDs
                customers = await context.CustomerAccounts.ToListAsync();

                // Add sample bookings and reviews
                var buses = await context.Buses.Take(3).ToListAsync();

                if (buses.Any())
                {
                    var bookings = new List<PublicBooking>();

                    for (int i = 0; i < customers.Count && i < buses.Count; i++)
                    {
                        var booking = new PublicBooking
                        {
                            BookingNumber = $"BK{DateTime.Now.Ticks + i}",
                            CustomerAccountId = customers[i].Id,
                            CustomerName = customers[i].Name,
                            CustomerEmail = customers[i].Email,
                            CustomerPhone = customers[i].Phone,
                            BusId = buses[i].Id,
                            PickupLocation = "Chennai",
                            Destination = "Kanyakumari",
                            DepartureDate = DateTime.Now.AddDays(-30),
                            PassengerCount = 4,
                            TotalAmount = 8000,
                            AdvanceAmount = 2000,
                            BalanceAmount = 6000,
                            Status = "Completed",
                            ConfirmedAt = DateTime.Now.AddDays(-29)
                        };

                        bookings.Add(booking);
                    }

                    await context.PublicBookings.AddRangeAsync(bookings);
                    await context.SaveChangesAsync();

                    // Reload bookings to get their IDs
                    bookings = await context.PublicBookings.ToListAsync();

                    // Add reviews
                    var reviews = new List<CustomerReview>();
                    for (int i = 0; i < bookings.Count; i++)
                    {
                        var review = new CustomerReview
                        {
                            PublicBookingId = bookings[i].Id,
                            CustomerAccountId = bookings[i].CustomerAccountId.Value,
                            BusId = bookings[i].BusId,
                            Rating = 4 + (i % 2), // Ratings between 4-5
                            Comment = i switch
                            {
                                0 => "Excellent service! The bus was clean, comfortable, and arrived on time. The driver was very professional and courteous. Highly recommended for family trips.",
                                1 => "Amazing experience with Sri Sai Senthil Tours. The booking process was smooth, and the bus had all the amenities as promised. Will definitely book again!",
                                _ => "Good value for money. The bus was comfortable and the journey was pleasant. Customer service was responsive and helpful throughout the trip."
                            },
                            IsApproved = true
                        };

                        reviews.Add(review);
                    }

                    await context.CustomerReviews.AddRangeAsync(reviews);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
