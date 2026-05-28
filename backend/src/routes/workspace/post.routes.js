const express = require('express');
const postController = require('../../controllers/workspace/post.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Universal auth
router.use(verifyAuth);

/**
 * GET /api/posts
 * Fetch all posts with filters
 */
router.get('/', postController.getPosts);

/**
 * POST /api/posts
 * Create a new post
 */
router.post('/', postController.createPost);

/**
 * POST /api/posts/bulk-approve
 * Bulk approve posts
 */
router.post('/bulk-approve', postController.bulkApprove);

/**
 * DELETE /api/posts/bulk
 * Bulk delete posts
 */
router.delete('/bulk', postController.bulkDelete);

/**
 * POST /api/posts/bulk-restore
 * Bulk restore posts from trash
 */
router.post('/bulk-restore', postController.bulkRestore);

/**
 * DELETE /api/posts/trash
 * Permanently delete all posts in trash
 */
router.delete('/trash', postController.emptyTrash);

/**
 * PUT /api/posts/:id
 * Update an existing post
 */
router.put('/:id', postController.updatePost);

const upload = require('../../middlewares/upload.middleware');

router.post('/upload', upload.single('video'), postController.uploadVideo);

module.exports = router;
