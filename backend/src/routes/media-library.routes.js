const express = require('express');
const mediaLibraryController = require('../controllers/media-library.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

/**
 * GET /api/media
 */
router.get('/', mediaLibraryController.getMediaFiles);

module.exports = router;
