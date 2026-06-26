const asyncHandler = require('../../utils/async-handler');
const aiService = require('../../services/workspace/ai/ai.service');

class AiController {
  getConfig = asyncHandler(async (req, res) => {
    const config = await aiService.getConfig();
    res.json(config);
  });

  getSettings = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) {
      return res.status(400).json({ error: 'Missing brandId parameter' });
    }
    const settings = await aiService.getSettings(brandId);
    res.json(settings);
  });

  updateSettings = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) {
      return res.status(400).json({ error: 'Missing brandId parameter' });
    }
    const settings = await aiService.updateSettings(brandId, req.body);
    res.json(settings);
  });

  generateContent = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    const userId = req.user.id;
    if (!brandId) {
      return res.status(400).json({ error: 'Missing brandId parameter' });
    }
    const result = await aiService.generateContent(userId, brandId, req.body);
    res.json(result);
  });

  quickPost = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    const userId = req.user.id;
    if (!brandId) {
      return res.status(400).json({ error: 'Missing brandId parameter' });
    }
    const post = await aiService.quickPost(userId, brandId, req.body);
    res.status(201).json(post);
  });
}

module.exports = new AiController();
