const postService = require('../../services/workspace/post.service');

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

  /**
   * POST /api/posts
   * Create a new post
   */
  async createPost(req, res) {
    try {
      const { brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });

      const userId = req.user.id;
      const post = await postService.createPost(req.body, userId, brandId);

      res.status(201).json({
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to create post'
      });
    }
  }

  /**
   * PUT /api/posts/:id
   * Update an existing post
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });

      const post = await postService.updatePost(id, req.body, brandId);

      res.status(200).json({
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to update post'
      });
    }
  }
}

module.exports = new PostController();
