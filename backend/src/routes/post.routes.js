const express = require('express');
const postController = require('../controllers/post.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Universal auth
router.use(verifyAuth);

/**
 * GET /api/posts
 * Fetch all posts with filters
 */
router.get('/', postController.getPosts);

module.exports = router;
