const mediaLibraryService = require('../../services/workspace/media-library.service');
const asyncHandler = require('../../utils/async-handler');

class MediaLibraryController {
  /**
   * GET /api/media
   */
  getMediaFiles = asyncHandler(async (req, res) => {
    // Mocking brandId for now, usually comes from active brand context
    const brandId = req.query.brandId || 'default-brand';
    const result = await mediaLibraryService.getMediaFiles(req.query, brandId);

    res.status(200).json({
      message: 'Media files retrieved successfully',
      ...result
    });
  });

  deleteMedia = asyncHandler(async (req, res) => {
    // Implementation
  });
}

module.exports = new MediaLibraryController();
