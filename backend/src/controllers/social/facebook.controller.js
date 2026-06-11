const facebookService = require('../../services/social/facebook');
const asyncHandler = require('../../utils/async-handler');

class FacebookController {
  getFacebookPublishedPosts = asyncHandler(async (req, res) => {
    const { brandId, pageToken, limit } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const result = await facebookService.getPublishedVideos(brandId, pageToken || null, limit ? parseInt(limit) : 10);
    res.json(result);
  });
}

module.exports = new FacebookController();
