const mediaLibraryService = require('../services/media-library.service');

class MediaLibraryController {
  /**
   * GET /api/media
   */
  async getMediaFiles(req, res) {
    try {
      // Mocking brandId for now, usually comes from active brand context
      const brandId = req.query.brandId || 'default-brand';
      const result = await mediaLibraryService.getMediaFiles(req.query, brandId);

      res.status(200).json({
        message: 'Media files retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteMedia(req, res) {
    // Implementation
  }
}

module.exports = new MediaLibraryController();
