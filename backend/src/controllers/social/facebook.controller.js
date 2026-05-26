const facebookService = require('../../services/social/facebook');
const asyncHandler = require('../../utils/async-handler');

class FacebookController {
  getFacebookPublishedPosts = asyncHandler(async (req, res) => {
    const { brandId, limit } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const data = await facebookService.getPublishedVideos(brandId, null, limit ? parseInt(limit) : 10);
    res.json({ data });
  });
}

module.exports = new FacebookController();
