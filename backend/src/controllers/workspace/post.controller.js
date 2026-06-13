const postService = require('../../services/workspace/post.service');
const asyncHandler = require('../../utils/async-handler');

class PostController {
  /**
   * GET /api/posts
   * Fetch all posts with filters.
   * brandId is required — prevents cross-brand data leakage via omission.
   */
  getPosts = asyncHandler(async (req, res) => {
    const brandId = req.query.brandId;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const result = await postService.getPosts(req.query, brandId);

    res.status(200).json({
      message: 'Posts retrieved successfully',
      ...result
    });
  });

  /**
   * POST /api/posts
   * Create a new post
   */
  createPost = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const userId = req.user.id;
    const post = await postService.createPost(req.body, userId, brandId);

    res.status(201).json({
      message: 'Post created successfully',
      data: post
    });
  });

  /**
   * PUT /api/posts/:id
   * Update an existing post
   */
  updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const post = await postService.updatePost(id, req.body, brandId, req.user.id);

    res.status(200).json({
      message: 'Post updated successfully',
      data: post
    });
  });

  /**
   * POST /api/posts/bulk-approve
   */
  bulkApprove = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const targetIds = this._getBulkIds(req.body);
    if (!targetIds) return res.status(400).json({ message: 'ids array is required' });

    const count = await postService.bulkApprove(targetIds, brandId);
    res.status(200).json({ message: 'Posts approved successfully', count });
  });

  /**
   * DELETE /api/posts/bulk
   */
  bulkDelete = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const targetIds = this._getBulkIds(req.body);
    if (!targetIds) return res.status(400).json({ message: 'ids array is required' });

    const count = await postService.bulkDelete(targetIds, brandId);
    res.status(200).json({ message: 'Posts deleted successfully', count });
  });

  /**
   * POST /api/posts/bulk-restore
   */
  bulkRestore = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const targetIds = this._getBulkIds(req.body);
    if (!targetIds) return res.status(400).json({ message: 'ids array is required' });

    const count = await postService.bulkRestore(targetIds, brandId);
    res.status(200).json({ message: 'Posts restored successfully', count });
  });

  /**
   * DELETE /api/posts/trash
   */
  emptyTrash = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const count = await postService.emptyTrash(brandId);
    res.status(200).json({ message: 'Trash emptied successfully', count });
  });

  /**
   * POST /api/posts/upload
   */
  uploadVideo = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    const videoUrl = req.file.path;
    res.status(200).json({ message: 'Video uploaded successfully', videoUrl });
  });

  // ============= Private Helper Methods =============

  _getBulkIds(body) {
    const targetIds = body.ids || body.postIds;
    return (targetIds && Array.isArray(targetIds)) ? targetIds : null;
  }
}

module.exports = new PostController();
