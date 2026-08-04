const facebookService = require('../../services/social/facebook');
const asyncHandler = require('../../utils/async-handler');

class FacebookController {
  // ── Published Posts ────────────────────────────────────────────────────────
  getFacebookPublishedPosts = asyncHandler(async (req, res) => {
    const { brandId, pageToken, limit } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const result = await facebookService.getPublishedVideos(
      brandId,
      pageToken || null,
      limit ? parseInt(limit) : 10
    );
    res.json(result);
  });

  // ── Competitors — Search ───────────────────────────────────────────────────
  searchFacebookPages = asyncHandler(async (req, res) => {
    const { brandId, query } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    if (!query)   return res.status(400).json({ message: 'query is required' });

    const pages = await facebookService.searchChannel(brandId, query);
    res.json({ data: pages });
  });

  // ── Competitors — Add ──────────────────────────────────────────────────────
  addFacebookCompetitor = asyncHandler(async (req, res) => {
    const { brandId, pageId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    if (!pageId)  return res.status(400).json({ message: 'pageId is required' });

    const competitor = await facebookService.addCompetitor(brandId, pageId);
    res.status(201).json({ message: 'Competitor added successfully', data: competitor });
  });

  // ── Competitors — List ─────────────────────────────────────────────────────
  getFacebookCompetitors = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const competitors = await facebookService.getCompetitors(brandId);
    res.json({ data: competitors });
  });

  // ── Competitors — Delete ───────────────────────────────────────────────────
  deleteFacebookCompetitor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id is required' });

    await facebookService.deleteCompetitor(id);
    res.json({ message: 'Competitor deleted successfully' });
  });
}

module.exports = new FacebookController();
