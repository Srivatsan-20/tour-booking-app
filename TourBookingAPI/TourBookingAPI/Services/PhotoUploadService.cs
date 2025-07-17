using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Models;

namespace TourBookingAPI.Services
{
    public interface IPhotoUploadService
    {
        Task<BusPhoto> UploadBusPhotoAsync(int busId, IFormFile file, string caption = null, bool isPrimary = false);
        Task<List<BusPhoto>> GetBusPhotosAsync(int busId);
        Task<bool> DeleteBusPhotoAsync(int photoId);
        Task<bool> SetPrimaryPhotoAsync(int busId, int photoId);
        Task<bool> UpdatePhotoOrderAsync(int busId, List<int> photoIds);
        Task<string> SaveFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string filePath);
    }

    public class PhotoUploadService : IPhotoUploadService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<PhotoUploadService> _logger;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public PhotoUploadService(
            AppDbContext context, 
            IWebHostEnvironment environment, 
            ILogger<PhotoUploadService> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<BusPhoto> UploadBusPhotoAsync(int busId, IFormFile file, string caption = null, bool isPrimary = false)
        {
            try
            {
                // Validate file
                if (file == null || file.Length == 0)
                    throw new ArgumentException("No file provided");

                if (file.Length > _maxFileSize)
                    throw new ArgumentException($"File size exceeds maximum limit of {_maxFileSize / (1024 * 1024)}MB");

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                    throw new ArgumentException($"File type {extension} is not allowed");

                // Verify bus exists
                var bus = await _context.Buses.FindAsync(busId);
                if (bus == null)
                    throw new ArgumentException("Bus not found");

                // Save file
                var fileName = $"bus_{busId}_{Guid.NewGuid()}{extension}";
                var filePath = await SaveFileAsync(file, "buses");

                // If this is set as primary, remove primary flag from other photos
                if (isPrimary)
                {
                    var existingPrimaryPhotos = await _context.BusPhotos
                        .Where(bp => bp.BusId == busId && bp.IsPrimary)
                        .ToListAsync();

                    foreach (var photo in existingPrimaryPhotos)
                    {
                        photo.IsPrimary = false;
                    }
                }

                // Get next display order
                var maxOrder = await _context.BusPhotos
                    .Where(bp => bp.BusId == busId)
                    .MaxAsync(bp => (int?)bp.DisplayOrder) ?? 0;

                var busPhoto = new BusPhoto
                {
                    BusId = busId,
                    FileName = fileName,
                    FilePath = filePath,
                    Caption = caption,
                    IsPrimary = isPrimary,
                    DisplayOrder = maxOrder + 1
                };

                _context.BusPhotos.Add(busPhoto);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Photo uploaded successfully for bus {BusId}: {FileName}", busId, fileName);
                return busPhoto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading photo for bus {BusId}", busId);
                throw;
            }
        }

        public async Task<List<BusPhoto>> GetBusPhotosAsync(int busId)
        {
            return await _context.BusPhotos
                .Where(bp => bp.BusId == busId)
                .OrderBy(bp => bp.DisplayOrder)
                .ThenByDescending(bp => bp.IsPrimary)
                .ToListAsync();
        }

        public async Task<bool> DeleteBusPhotoAsync(int photoId)
        {
            try
            {
                var photo = await _context.BusPhotos.FindAsync(photoId);
                if (photo == null)
                    return false;

                // Delete physical file
                await DeleteFileAsync(photo.FilePath);

                // Remove from database
                _context.BusPhotos.Remove(photo);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Photo deleted successfully: {PhotoId}", photoId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting photo {PhotoId}", photoId);
                return false;
            }
        }

        public async Task<bool> SetPrimaryPhotoAsync(int busId, int photoId)
        {
            try
            {
                // Remove primary flag from all photos of this bus
                var allPhotos = await _context.BusPhotos
                    .Where(bp => bp.BusId == busId)
                    .ToListAsync();

                foreach (var photo in allPhotos)
                {
                    photo.IsPrimary = photo.Id == photoId;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting primary photo {PhotoId} for bus {BusId}", photoId, busId);
                return false;
            }
        }

        public async Task<bool> UpdatePhotoOrderAsync(int busId, List<int> photoIds)
        {
            try
            {
                var photos = await _context.BusPhotos
                    .Where(bp => bp.BusId == busId && photoIds.Contains(bp.Id))
                    .ToListAsync();

                for (int i = 0; i < photoIds.Count; i++)
                {
                    var photo = photos.FirstOrDefault(p => p.Id == photoIds[i]);
                    if (photo != null)
                    {
                        photo.DisplayOrder = i + 1;
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating photo order for bus {BusId}", busId);
                return false;
            }
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folder);
                
                // Create directory if it doesn't exist
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return relative path for database storage
                return $"/uploads/{folder}/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file to {Folder}", folder);
                throw;
            }
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return true;

                var fullPath = Path.Combine(_environment.WebRootPath, filePath.TrimStart('/'));
                
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    _logger.LogInformation("File deleted: {FilePath}", filePath);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
                return false;
            }
        }
    }

    // DTO for photo upload response
    public class PhotoUploadResponse
    {
        public int PhotoId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Caption { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    // DTO for photo order update
    public class UpdatePhotoOrderRequest
    {
        public List<int> PhotoIds { get; set; } = new List<int>();
    }

    // DTO for setting primary photo
    public class SetPrimaryPhotoRequest
    {
        public int PhotoId { get; set; }
    }
}
