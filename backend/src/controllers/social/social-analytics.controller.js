const socialService = require('../../services/social/social.service');
const asyncHandler = require('../../utils/async-handler');

class SocialAnalyticsController {
  getMetrics = asyncHandler(async (req, res) => {
    const { brandId, startDate, endDate } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const data = await socialService.getAggregatedMetrics(brandId, startDate, endDate);
    res.json({ message: 'Metrics synced successfully', data });
  });
}

module.exports = new SocialAnalyticsController();
