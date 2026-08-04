const postService = require('../../services/workspace/post.service');
const storageService = require('../../services/storage');
const asyncHandler = require('../../utils/async-handler');
const path = require('path');
const crypto = require('crypto');

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
   * GET /api/posts/platform-limits
   * Fetch all limits configuration from DB
   */
  getPlatformLimits = asyncHandler(async (req, res) => {
    const prisma = require('../../config/prisma');
    const limits = await prisma.platformLimit.findMany();
    res.status(200).json({
      message: 'Platform limits retrieved successfully',
      data: limits
    });
  });

  /**
   * POST /api/posts
   * Create a new post
   */
  createPost = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    console.log("=== CREATE POST ===");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

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
    const { brandId, deleteFromSocials } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const targetIds = this._getBulkIds(req.body);
    if (!targetIds) return res.status(400).json({ message: 'ids array is required' });

    const count = await postService.bulkDelete(targetIds, brandId, deleteFromSocials === true || deleteFromSocials === 'true');
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
   * Upload video/image file to storage (S3 or local).
   */
  uploadVideo = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const brandId = req.body.brandId || req.query.brandId || 'unassigned';
    const ext = path.extname(req.file.originalname).toLowerCase();
    const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const safeName = path.basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 50);

    let subfolder = 'videos';
    if (req.file.mimetype.startsWith('image/')) subfolder = 'images';

    const key = `media/${brandId}/${subfolder}/${uniqueId}-${safeName}${ext}`;
    const { url } = await storageService.upload(req.file.buffer, key, req.file.mimetype);

    console.log(`[Upload] Storage: key="${key}" → url="${url}"`);

    res.status(200).json({ message: 'Video uploaded successfully', videoUrl: url });
  });

  // ============= Private Helper Methods =============

  _getBulkIds(body) {
    const targetIds = body.ids || body.postIds;
    return (targetIds && Array.isArray(targetIds)) ? targetIds : null;
  }
}

module.exports = new PostController();
