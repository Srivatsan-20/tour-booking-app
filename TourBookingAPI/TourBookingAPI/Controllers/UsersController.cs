using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace TourBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Name,
                    u.Role,
                    u.Phone,
                    u.Status,
                    u.CreatedAt,
                    u.LastLogin,
                    u.Notes
                    // Exclude PasswordHash for security
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Name,
                    u.Role,
                    u.Phone,
                    u.Status,
                    u.CreatedAt,
                    u.LastLogin,
                    u.Notes
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<object>> PostUser(CreateUserRequest request)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("Username already exists");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email already exists");
            }

            // Hash the password
            var passwordHash = HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Name = request.Name,
                Role = request.Role,
                PasswordHash = passwordHash,
                Phone = request.Phone,
                Status = request.Status ?? "active",
                CreatedAt = DateTime.UtcNow,
                Notes = request.Notes
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return user without password hash
            var result = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Name,
                user.Role,
                user.Phone,
                user.Status,
                user.CreatedAt,
                user.LastLogin,
                user.Notes
            };

            return CreatedAtAction("GetUser", new { id = user.Id }, result);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Check if username is being changed and if it already exists
            if (request.Username != user.Username && 
                await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != id))
            {
                return BadRequest("Username already exists");
            }

            // Check if email is being changed and if it already exists
            if (request.Email != user.Email && 
                await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            {
                return BadRequest("Email already exists");
            }

            // Update user properties
            user.Username = request.Username;
            user.Email = request.Email;
            user.Name = request.Name;
            user.Role = request.Role;
            user.Phone = request.Phone;
            user.Status = request.Status;
            user.Notes = request.Notes;

            // Update password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.PasswordHash = HashPassword(request.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/authenticate
        [HttpPost("authenticate")]
        public async Task<ActionResult<object>> Authenticate(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Status == "active");

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Return user info without password
            var result = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Name,
                user.Role,
                user.Phone,
                user.Status,
                user.CreatedAt,
                user.LastLogin
            };

            return Ok(result);
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var passwordHash = HashPassword(password);
            return passwordHash == hash;
        }
    }

    // Request DTOs
    public class CreateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Password { get; set; } // Optional for updates
        public string? Phone { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
