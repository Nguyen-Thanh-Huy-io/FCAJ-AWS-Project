const searchService = require('../services/search.service');

class SearchController {
  async searchAll(req, res) {
    try {
      const { q } = req.query;
      const user = req.user; // Attached by verifyAuth middleware

      console.log(`[Search API] Query: "${q}" | User: ID=${user?.id}, Role=${user?.role}`);

      if (!q || !q.trim()) {
        return res.status(200).json([]);
      }

      const results = await searchService.searchAll(q, user);
      console.log(`[Search API] Found ${results.length} results`);
      return res.status(200).json(results);
    } catch (error) {
      console.error('[Search API] Error occurred:', error);
      return res.status(500).json({ message: error.message || 'An error occurred during search' });
    }
  }
}

module.exports = new SearchController();
