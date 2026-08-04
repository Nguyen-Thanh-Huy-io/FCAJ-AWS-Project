const express = require('express');
const autoListController = require('../../controllers/workspace/auto-list.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

router.get('/', autoListController.getAutoLists);
router.get('/:id', autoListController.getAutoListDetails);
router.post('/', autoListController.createAutoList);
router.put('/:id', autoListController.updateAutoList);
router.delete('/:id', autoListController.deleteAutoList);
router.patch('/:id/toggle', autoListController.toggleStatus);
router.put('/:id/reorder', autoListController.reorderPosts);

module.exports = router;
