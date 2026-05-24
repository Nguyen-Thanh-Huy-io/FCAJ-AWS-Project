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

  /**
   * POST /api/posts/bulk-approve
   * Bulk approve posts
   */
  async bulkApprove(req, res) {
    try {
      const { postIds, ids, brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });
      
      const targetIds = ids || postIds;
      if (!targetIds || !Array.isArray(targetIds)) return res.status(400).json({ message: 'ids array is required' });

      const count = await postService.bulkApprove(targetIds, brandId);

      res.status(200).json({
        message: 'Posts approved successfully',
        count
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to approve posts'
      });
    }
  }

  /**
   * DELETE /api/posts/bulk
   * Bulk delete posts
   */
  async bulkDelete(req, res) {
    try {
      const { postIds, ids, brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });
      
      const targetIds = ids || postIds;
      if (!targetIds || !Array.isArray(targetIds)) return res.status(400).json({ message: 'ids array is required' });

      const count = await postService.bulkDelete(targetIds, brandId);

      res.status(200).json({
        message: 'Posts deleted successfully',
        count
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to delete posts'
      });
    }
  }

  /**
   * POST /api/posts/bulk-restore
   * Bulk restore posts from trash
   */
  async bulkRestore(req, res) {
    try {
      const { postIds, ids, brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });
      
      const targetIds = ids || postIds;
      if (!targetIds || !Array.isArray(targetIds)) return res.status(400).json({ message: 'ids array is required' });

      const count = await postService.bulkRestore(targetIds, brandId);

      res.status(200).json({
        message: 'Posts restored successfully',
        count
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to restore posts'
      });
    }
  }

  /**
   * DELETE /api/posts/trash
   * Permanently delete all posts in trash
   */
  async emptyTrash(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });

      const count = await postService.emptyTrash(brandId);

      res.status(200).json({
        message: 'Trash emptied successfully',
        count
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to empty trash'
      });
    }
  }
}

module.exports = new PostController();
