const livestreamService = require('../../services/workspace/livestream.service');

class LivestreamController {
  /**
   * GET /api/livestreams/history
   * Fetch stream history with filters
   */
  async getStreamHistory(req, res) {
    try {
      const brandId = req.query.brandId || 'default-brand';
      const result = await livestreamService.getStreamHistory(req.query, brandId);

      res.status(200).json({
        message: 'Stream history retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to retrieve stream history'
      });
    }
  }

  /**
   * GET /api/livestreams/:id
   * Fetch single stream details
   */
  async getStreamById(req, res) {
    // Implementation for later if needed
  }
}

module.exports = new LivestreamController();
