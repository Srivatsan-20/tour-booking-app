using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Services
{
    public interface IPublicBookingService
    {
        Task<List<PublicBusSearchResponse>> SearchAvailableBusesAsync(PublicBusSearchRequest request);
        Task<PublicBusDetailsResponse> GetBusDetailsAsync(int busId);
        Task<PublicBookingResponse> CreateBookingAsync(CreatePublicBookingRequest request);
        Task<PublicBooking> GetBookingAsync(int bookingId);
        Task<PublicBooking> GetBookingByNumberAsync(string bookingNumber);
        Task<List<PublicBooking>> GetCustomerBookingsAsync(int customerAccountId);
        Task<bool> CancelBookingAsync(int bookingId, string reason);
        Task<CustomerLoginResponse> RegisterCustomerAsync(CustomerAccountRegistrationRequest request);
        Task<CustomerLoginResponse> LoginCustomerAsync(CustomerLoginRequest request);
        Task<bool> VerifyCustomerEmailAsync(string token);
        Task<List<CustomerReview>> GetBusReviewsAsync(int busId);
        Task<CustomerReview> AddReviewAsync(int bookingId, int customerId, int rating, string comment);
    }

    public class PublicBookingService : IPublicBookingService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PublicBookingService> _logger;

        public PublicBookingService(AppDbContext context, ILogger<PublicBookingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<PublicBusSearchResponse>> SearchAvailableBusesAsync(PublicBusSearchRequest request)
        {
            try
            {
                var departureDate = request.DepartureDate.Date;
                var returnDate = request.ReturnDate?.Date ?? departureDate;
                var numberOfDays = (returnDate - departureDate).Days + 1;

                // Get all buses first
                var allBuses = await _context.Buses
                    .Where(b => b.Status == BusStatus.Available)
                    .ToListAsync();

                // Filter by capacity in memory
                allBuses = allBuses.Where(b => b.TotalCapacity >= request.PassengerCount).ToList();

                // Get conflicting allocations
                var conflictingAllocations = await _context.BusAllocations
                    .Where(ba => ba.TripStartDate <= returnDate && ba.TripEndDate >= departureDate)
                    .Select(ba => ba.BusId)
                    .ToListAsync();

                // Filter available buses
                var availableBuses = allBuses
                    .Where(b => !conflictingAllocations.Contains(b.Id))
                    .Select(b => new PublicBusSearchResponse
                    {
                        BusId = b.Id,
                        BusName = $"{b.Make} {b.Model}",
                        BusType = b.BusType,
                        Capacity = b.TotalCapacity,
                        PricePerDay = b.DefaultPerDayRent,
                        TotalPrice = b.DefaultPerDayRent * numberOfDays,
                        NumberOfDays = numberOfDays,
                        PrimaryImageUrl = "/images/default-bus.jpg", // Default image for now
                        AverageRating = 4.5, // Default rating for now
                        ReviewCount = 50, // Default review count for now
                        KeyAmenities = new List<string> { "AC", "Comfortable Seats", "Safety Features" } // Default amenities
                    })
                    .ToList();

                return availableBuses;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching available buses");
                throw;
            }
        }

        public async Task<PublicBusDetailsResponse> GetBusDetailsAsync(int busId)
        {
            try
            {
                var bus = await _context.Buses
                    .Where(b => b.Id == busId && b.IsAvailable)
                    .Select(b => new PublicBusDetailsResponse
                    {
                        BusId = b.Id,
                        BusName = $"{b.Make} {b.Model}",
                        BusType = b.BusType,
                        Capacity = b.TotalCapacity,
                        Description = b.Features,
                        PricePerDay = b.DefaultPerDayRent,
                        AverageRating = _context.CustomerReviews
                            .Where(cr => cr.BusId == b.Id && cr.IsApproved)
                            .Average(cr => (double?)cr.Rating) ?? 0.0,
                        ReviewCount = _context.CustomerReviews
                            .Count(cr => cr.BusId == b.Id && cr.IsApproved),
                        Photos = _context.BusPhotos
                            .Where(bp => bp.BusId == b.Id)
                            .OrderBy(bp => bp.DisplayOrder)
                            .Select(bp => new BusPhotoDto
                            {
                                Id = bp.Id,
                                FileName = bp.FileName,
                                FilePath = bp.FilePath,
                                Caption = bp.Caption,
                                IsPrimary = bp.IsPrimary,
                                DisplayOrder = bp.DisplayOrder
                            })
                            .ToList(),
                        Amenities = _context.BusAmenityMappings
                            .Where(bam => bam.BusId == b.Id)
                            .Join(_context.BusAmenities, bam => bam.BusAmenityId, ba => ba.Id,
                                (bam, ba) => new BusAmenityDto
                                {
                                    Id = ba.Id,
                                    Name = ba.Name,
                                    Description = ba.Description,
                                    Icon = ba.Icon
                                })
                            .ToList(),
                        Reviews = _context.CustomerReviews
                            .Where(cr => cr.BusId == b.Id && cr.IsApproved)
                            .OrderByDescending(cr => cr.CreatedAt)
                            .Take(10)
                            .Join(_context.CustomerAccounts, cr => cr.CustomerAccountId, ca => ca.Id,
                                (cr, ca) => new CustomerReviewDto
                                {
                                    Id = cr.Id,
                                    CustomerName = ca.Name,
                                    Rating = cr.Rating,
                                    Comment = cr.Comment,
                                    CreatedAt = cr.CreatedAt
                                })
                            .ToList()
                    })
                    .FirstOrDefaultAsync();

                return bus;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bus details for ID {BusId}", busId);
                throw;
            }
        }

        public async Task<PublicBookingResponse> CreateBookingAsync(CreatePublicBookingRequest request)
        {
            try
            {
                // Generate unique booking number
                var bookingNumber = GenerateBookingNumber();

                var booking = new PublicBooking
                {
                    BookingNumber = bookingNumber,
                    CustomerName = request.CustomerName,
                    CustomerEmail = request.CustomerEmail,
                    CustomerPhone = request.CustomerPhone,
                    BusId = request.BusId,
                    PickupLocation = request.PickupLocation,
                    Destination = request.Destination,
                    DepartureDate = request.DepartureDate,
                    ReturnDate = request.ReturnDate,
                    PassengerCount = request.PassengerCount,
                    SpecialRequirements = request.SpecialRequirements,
                    TotalAmount = request.TotalAmount,
                    AdvanceAmount = request.AdvanceAmount,
                    BalanceAmount = request.TotalAmount - request.AdvanceAmount,
                    Status = "Pending"
                };

                _context.PublicBookings.Add(booking);
                await _context.SaveChangesAsync();

                return new PublicBookingResponse
                {
                    BookingId = booking.Id,
                    BookingNumber = booking.BookingNumber,
                    Status = booking.Status,
                    TotalAmount = booking.TotalAmount,
                    AdvanceAmount = booking.AdvanceAmount,
                    BalanceAmount = booking.BalanceAmount,
                    CreatedAt = booking.CreatedAt,
                    PaymentUrl = $"/payment/{booking.BookingNumber}" // Will be implemented with payment gateway
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                throw;
            }
        }

        public async Task<PublicBooking> GetBookingAsync(int bookingId)
        {
            return await _context.PublicBookings
                .Include(pb => pb.Bus)
                .Include(pb => pb.CustomerAccount)
                .Include(pb => pb.Payments)
                .FirstOrDefaultAsync(pb => pb.Id == bookingId);
        }

        public async Task<PublicBooking> GetBookingByNumberAsync(string bookingNumber)
        {
            return await _context.PublicBookings
                .Include(pb => pb.Bus)
                .Include(pb => pb.CustomerAccount)
                .Include(pb => pb.Payments)
                .FirstOrDefaultAsync(pb => pb.BookingNumber == bookingNumber);
        }

        public async Task<List<PublicBooking>> GetCustomerBookingsAsync(int customerAccountId)
        {
            return await _context.PublicBookings
                .Include(pb => pb.Bus)
                .Include(pb => pb.Payments)
                .Where(pb => pb.CustomerAccountId == customerAccountId)
                .OrderByDescending(pb => pb.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> CancelBookingAsync(int bookingId, string reason)
        {
            try
            {
                var booking = await _context.PublicBookings.FindAsync(bookingId);
                if (booking == null || booking.Status == "Cancelled")
                    return false;

                booking.Status = "Cancelled";
                booking.CancelledAt = DateTime.UtcNow;
                booking.CancellationReason = reason;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling booking {BookingId}", bookingId);
                return false;
            }
        }

        public async Task<CustomerLoginResponse> RegisterCustomerAsync(CustomerAccountRegistrationRequest request)
        {
            try
            {
                // Check if email already exists
                var existingCustomer = await _context.CustomerAccounts
                    .FirstOrDefaultAsync(ca => ca.Email == request.Email);

                if (existingCustomer != null)
                    throw new InvalidOperationException("Email already registered");

                // Hash password
                var (passwordHash, passwordSalt) = HashPassword(request.Password);

                var customer = new CustomerAccount
                {
                    Name = request.Name,
                    Email = request.Email,
                    Phone = request.Phone,
                    Address = request.Address,
                    City = request.City,
                    State = request.State,
                    PostalCode = request.PostalCode,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    VerificationToken = Guid.NewGuid().ToString(),
                    VerificationTokenExpiry = DateTime.UtcNow.AddDays(1)
                };

                _context.CustomerAccounts.Add(customer);
                await _context.SaveChangesAsync();

                // Generate JWT token (simplified for now)
                var token = GenerateJwtToken(customer);

                return new CustomerLoginResponse
                {
                    CustomerId = customer.Id,
                    Name = customer.Name,
                    Email = customer.Email,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(30)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering customer");
                throw;
            }
        }

        public async Task<CustomerLoginResponse> LoginCustomerAsync(CustomerLoginRequest request)
        {
            try
            {
                var customer = await _context.CustomerAccounts
                    .FirstOrDefaultAsync(ca => ca.Email == request.Email);

                if (customer == null || !VerifyPassword(request.Password, customer.PasswordHash, customer.PasswordSalt))
                    throw new UnauthorizedAccessException("Invalid email or password");

                customer.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(customer);

                return new CustomerLoginResponse
                {
                    CustomerId = customer.Id,
                    Name = customer.Name,
                    Email = customer.Email,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(30)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in customer");
                throw;
            }
        }

        public async Task<bool> VerifyCustomerEmailAsync(string token)
        {
            try
            {
                var customer = await _context.CustomerAccounts
                    .FirstOrDefaultAsync(ca => ca.VerificationToken == token &&
                                             ca.VerificationTokenExpiry > DateTime.UtcNow);

                if (customer == null)
                    return false;

                customer.IsVerified = true;
                customer.VerificationToken = null;
                customer.VerificationTokenExpiry = null;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying customer email");
                return false;
            }
        }

        public async Task<List<CustomerReview>> GetBusReviewsAsync(int busId)
        {
            return await _context.CustomerReviews
                .Include(cr => cr.CustomerAccount)
                .Where(cr => cr.BusId == busId && cr.IsApproved)
                .OrderByDescending(cr => cr.CreatedAt)
                .ToListAsync();
        }

        public async Task<CustomerReview> AddReviewAsync(int bookingId, int customerId, int rating, string comment)
        {
            try
            {
                var booking = await _context.PublicBookings
                    .FirstOrDefaultAsync(pb => pb.Id == bookingId && pb.CustomerAccountId == customerId);

                if (booking == null || booking.Status != "Completed")
                    throw new InvalidOperationException("Cannot review this booking");

                var existingReview = await _context.CustomerReviews
                    .FirstOrDefaultAsync(cr => cr.PublicBookingId == bookingId);

                if (existingReview != null)
                    throw new InvalidOperationException("Review already exists for this booking");

                var review = new CustomerReview
                {
                    PublicBookingId = bookingId,
                    CustomerAccountId = customerId,
                    BusId = booking.BusId,
                    Rating = rating,
                    Comment = comment
                };

                _context.CustomerReviews.Add(review);
                await _context.SaveChangesAsync();

                return review;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding review");
                throw;
            }
        }

        // Helper methods
        private string GenerateBookingNumber()
        {
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(1000, 9999);
            return $"BK{timestamp}{random}";
        }

        private (string hash, string salt) HashPassword(string password)
        {
            using var hmac = new HMACSHA512();
            var salt = Convert.ToBase64String(hmac.Key);
            var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return (hash, salt);
        }

        private bool VerifyPassword(string password, string hash, string salt)
        {
            using var hmac = new HMACSHA512(Convert.FromBase64String(salt));
            var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return computedHash == hash;
        }

        private string GenerateJwtToken(CustomerAccount customer)
        {
            // Simplified token generation - in production, use proper JWT library
            var tokenData = $"{customer.Id}:{customer.Email}:{DateTime.UtcNow.AddDays(30):yyyy-MM-dd}";
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(tokenData));
        }
    }
}
