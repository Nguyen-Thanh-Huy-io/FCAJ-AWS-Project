const livestreamService = require('../../services/workspace/livestream.service');
const asyncHandler = require('../../utils/async-handler');

class LivestreamController {
  /**
   * GET /api/livestreams/history
   * Fetch stream history with filters
   */
  getStreamHistory = asyncHandler(async (req, res) => {
    const brandId = req.query.brandId || 'default-brand';
    const result = await livestreamService.getStreamHistory(req.query, brandId);

    res.status(200).json({
      message: 'Stream history retrieved successfully',
      ...result
    });
  });

  /**
   * GET /api/livestreams/:id
   * Fetch single stream details
   */
  getStreamById = asyncHandler(async (req, res) => {
    // Implementation for later if needed
  });
}

module.exports = new LivestreamController();
