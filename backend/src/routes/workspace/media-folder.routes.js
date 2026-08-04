const express = require('express');
const mediaFolderController = require('../../controllers/workspace/media-folder.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

router.get('/', mediaFolderController.getFolders);
router.post('/', mediaFolderController.createFolder);
router.put('/:id', mediaFolderController.updateFolder);
router.delete('/:id', mediaFolderController.deleteFolder);

module.exports = router;
