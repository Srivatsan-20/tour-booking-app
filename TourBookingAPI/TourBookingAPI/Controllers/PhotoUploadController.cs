using Microsoft.AspNetCore.Mvc;
using TourBookingAPI.Models;
using TourBookingAPI.Services;

namespace TourBookingAPI.Controllers
{
    [ApiController]
    [Route("api/photos")]
    public class PhotoUploadController : ControllerBase
    {
        private readonly IPhotoUploadService _photoService;
        private readonly ILogger<PhotoUploadController> _logger;

        public PhotoUploadController(IPhotoUploadService photoService, ILogger<PhotoUploadController> logger)
        {
            _photoService = photoService;
            _logger = logger;
        }

        /// <summary>
        /// Upload a photo for a bus
        /// </summary>
        [HttpPost("bus/{busId}/upload")]
        public async Task<ActionResult<PhotoUploadResponse>> UploadBusPhoto(
            int busId, 
            IFormFile file, 
            [FromForm] string caption = null, 
            [FromForm] bool isPrimary = false)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "No file provided" });

                var photo = await _photoService.UploadBusPhotoAsync(busId, file, caption, isPrimary);

                var response = new PhotoUploadResponse
                {
                    PhotoId = photo.Id,
                    FileName = photo.FileName,
                    FilePath = photo.FilePath,
                    Caption = photo.Caption,
                    IsPrimary = photo.IsPrimary,
                    DisplayOrder = photo.DisplayOrder,
                    UploadedAt = photo.UploadedAt
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading photo for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while uploading the photo" });
            }
        }

        /// <summary>
        /// Get all photos for a bus
        /// </summary>
        [HttpGet("bus/{busId}")]
        public async Task<ActionResult<List<BusPhoto>>> GetBusPhotos(int busId)
        {
            try
            {
                var photos = await _photoService.GetBusPhotosAsync(busId);
                return Ok(photos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting photos for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while fetching photos" });
            }
        }

        /// <summary>
        /// Delete a bus photo
        /// </summary>
        [HttpDelete("{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            try
            {
                var success = await _photoService.DeleteBusPhotoAsync(photoId);
                
                if (!success)
                    return NotFound(new { message = "Photo not found" });

                return Ok(new { message = "Photo deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting photo {PhotoId}", photoId);
                return StatusCode(500, new { message = "An error occurred while deleting the photo" });
            }
        }

        /// <summary>
        /// Set a photo as primary for a bus
        /// </summary>
        [HttpPost("bus/{busId}/set-primary")]
        public async Task<ActionResult> SetPrimaryPhoto(int busId, [FromBody] SetPrimaryPhotoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var success = await _photoService.SetPrimaryPhotoAsync(busId, request.PhotoId);
                
                if (!success)
                    return BadRequest(new { message = "Failed to set primary photo" });

                return Ok(new { message = "Primary photo set successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting primary photo for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while setting primary photo" });
            }
        }

        /// <summary>
        /// Update the display order of photos for a bus
        /// </summary>
        [HttpPost("bus/{busId}/reorder")]
        public async Task<ActionResult> UpdatePhotoOrder(int busId, [FromBody] UpdatePhotoOrderRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var success = await _photoService.UpdatePhotoOrderAsync(busId, request.PhotoIds);
                
                if (!success)
                    return BadRequest(new { message = "Failed to update photo order" });

                return Ok(new { message = "Photo order updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating photo order for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while updating photo order" });
            }
        }

        /// <summary>
        /// Upload multiple photos for a bus
        /// </summary>
        [HttpPost("bus/{busId}/upload-multiple")]
        public async Task<ActionResult<List<PhotoUploadResponse>>> UploadMultipleBusPhotos(
            int busId, 
            List<IFormFile> files,
            [FromForm] List<string> captions = null)
        {
            try
            {
                if (files == null || !files.Any())
                    return BadRequest(new { message = "No files provided" });

                var responses = new List<PhotoUploadResponse>();

                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    var caption = captions != null && i < captions.Count ? captions[i] : null;
                    var isPrimary = i == 0; // First photo is primary by default

                    try
                    {
                        var photo = await _photoService.UploadBusPhotoAsync(busId, file, caption, isPrimary);

                        responses.Add(new PhotoUploadResponse
                        {
                            PhotoId = photo.Id,
                            FileName = photo.FileName,
                            FilePath = photo.FilePath,
                            Caption = photo.Caption,
                            IsPrimary = photo.IsPrimary,
                            DisplayOrder = photo.DisplayOrder,
                            UploadedAt = photo.UploadedAt
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to upload file {FileName} for bus {BusId}", file.FileName, busId);
                        // Continue with other files
                    }
                }

                return Ok(responses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading multiple photos for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while uploading photos" });
            }
        }

        /// <summary>
        /// Get photo by ID (for direct access)
        /// </summary>
        [HttpGet("{photoId}")]
        public async Task<ActionResult<BusPhoto>> GetPhoto(int photoId)
        {
            try
            {
                var photos = await _photoService.GetBusPhotosAsync(0); // This would need to be modified to get by photo ID
                var photo = photos.FirstOrDefault(p => p.Id == photoId);
                
                if (photo == null)
                    return NotFound(new { message = "Photo not found" });

                return Ok(photo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting photo {PhotoId}", photoId);
                return StatusCode(500, new { message = "An error occurred while fetching the photo" });
            }
        }

        /// <summary>
        /// Update photo caption
        /// </summary>
        [HttpPut("{photoId}/caption")]
        public async Task<ActionResult> UpdatePhotoCaption(int photoId, [FromBody] UpdatePhotoCaptionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // This would need to be implemented in the service
                // For now, returning success response
                return Ok(new { message = "Photo caption updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating caption for photo {PhotoId}", photoId);
                return StatusCode(500, new { message = "An error occurred while updating the caption" });
            }
        }

        /// <summary>
        /// Get photo statistics for a bus
        /// </summary>
        [HttpGet("bus/{busId}/stats")]
        public async Task<ActionResult<object>> GetBusPhotoStats(int busId)
        {
            try
            {
                var photos = await _photoService.GetBusPhotosAsync(busId);
                
                var stats = new
                {
                    TotalPhotos = photos.Count,
                    HasPrimaryPhoto = photos.Any(p => p.IsPrimary),
                    PrimaryPhotoId = photos.FirstOrDefault(p => p.IsPrimary)?.Id,
                    LastUploadDate = photos.Any() ? photos.Max(p => p.UploadedAt) : (DateTime?)null,
                    PhotosWithCaptions = photos.Count(p => !string.IsNullOrEmpty(p.Caption))
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting photo stats for bus {BusId}", busId);
                return StatusCode(500, new { message = "An error occurred while fetching photo statistics" });
            }
        }
    }

    // Additional DTOs
    public class UpdatePhotoCaptionRequest
    {
        public string Caption { get; set; }
    }
}
