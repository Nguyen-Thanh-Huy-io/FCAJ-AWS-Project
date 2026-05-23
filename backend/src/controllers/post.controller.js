const postService = require('../services/post.service');

class PostController {
  /**
   * GET /api/posts
   * Fetch all posts with filters
   */
  async getPosts(req, res) {
    try {
      const brandId = req.query.brandId || 'default-brand';
      const result = await postService.getPosts(req.query, brandId);

      res.status(200).json({
        message: 'Posts retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to retrieve posts'
      });
    }
  }
}

module.exports = new PostController();
