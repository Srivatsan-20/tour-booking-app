using Microsoft.AspNetCore.Mvc;
using TourBookingAPI.Models;
using TourBookingAPI.Services;

namespace TourBookingAPI.Controllers
{
    [ApiController]
    [Route("api/public/account")]
    public class CustomerAccountController : ControllerBase
    {
        private readonly IPublicBookingService _bookingService;
        private readonly ILogger<CustomerAccountController> _logger;

        public CustomerAccountController(IPublicBookingService bookingService, ILogger<CustomerAccountController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new customer account
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<CustomerLoginResponse>> Register([FromBody] CustomerAccountRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var response = await _bookingService.RegisterCustomerAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering customer");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        /// <summary>
        /// Login customer
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<CustomerLoginResponse>> Login([FromBody] CustomerLoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var response = await _bookingService.LoginCustomerAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in customer");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        /// <summary>
        /// Verify customer email
        /// </summary>
        [HttpGet("verify")]
        public async Task<ActionResult> VerifyEmail([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                    return BadRequest(new { message = "Verification token is required" });

                var success = await _bookingService.VerifyCustomerEmailAsync(token);
                
                if (!success)
                    return BadRequest(new { message = "Invalid or expired verification token" });

                return Ok(new { message = "Email verified successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying email");
                return StatusCode(500, new { message = "An error occurred during email verification" });
            }
        }

        /// <summary>
        /// Get customer bookings (requires authentication)
        /// </summary>
        [HttpGet("{customerId}/bookings")]
        public async Task<ActionResult<List<PublicBooking>>> GetCustomerBookings(int customerId)
        {
            try
            {
                // In a real implementation, you would verify the customer ID from JWT token
                var bookings = await _bookingService.GetCustomerBookingsAsync(customerId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting customer bookings for {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while fetching bookings" });
            }
        }

        /// <summary>
        /// Get customer profile (requires authentication)
        /// </summary>
        [HttpGet("{customerId}/profile")]
        public async Task<ActionResult<CustomerProfileResponse>> GetProfile(int customerId)
        {
            try
            {
                // This would typically be implemented with proper authentication
                // For now, returning a placeholder response
                var profile = new CustomerProfileResponse
                {
                    CustomerId = customerId,
                    Name = "Customer Name",
                    Email = "customer@example.com",
                    Phone = "1234567890",
                    TotalBookings = 0,
                    CompletedBookings = 0,
                    MemberSince = DateTime.UtcNow
                };

                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting customer profile for {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while fetching profile" });
            }
        }

        /// <summary>
        /// Update customer profile (requires authentication)
        /// </summary>
        [HttpPut("{customerId}/profile")]
        public async Task<ActionResult> UpdateProfile(int customerId, [FromBody] UpdateCustomerProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Implementation would update customer profile in database
                // For now, returning success response
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer profile for {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while updating profile" });
            }
        }

        /// <summary>
        /// Change customer password (requires authentication)
        /// </summary>
        [HttpPost("{customerId}/change-password")]
        public async Task<ActionResult> ChangePassword(int customerId, [FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Implementation would verify current password and update to new password
                // For now, returning success response
                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for customer {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

        /// <summary>
        /// Request password reset
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Implementation would send password reset email
                // For now, returning success response
                return Ok(new { message = "Password reset instructions sent to your email" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing forgot password request");
                return StatusCode(500, new { message = "An error occurred while processing the request" });
            }
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Implementation would verify reset token and update password
                // For now, returning success response
                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password");
                return StatusCode(500, new { message = "An error occurred while resetting password" });
            }
        }
    }

    // Additional DTOs for customer account management
    public class CustomerProfileResponse
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public DateTime MemberSince { get; set; }
        public bool IsVerified { get; set; }
    }

    public class UpdateCustomerProfileRequest
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class ForgotPasswordRequest
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
