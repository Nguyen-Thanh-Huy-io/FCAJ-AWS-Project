const express = require('express');
const mediaLibraryController = require('../../controllers/workspace/media-library.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

router.use(verifyAuth);

/**
 * GET /api/media
 */
router.get('/', mediaLibraryController.getMediaFiles);

/**
 * POST /api/media/upload
 */
router.post('/upload', upload.single('file'), mediaLibraryController.uploadMedia);

/**
 * DELETE /api/media/:id
 */
router.delete('/:id', mediaLibraryController.deleteMedia);

module.exports = router;
