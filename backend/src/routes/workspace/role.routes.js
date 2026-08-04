const express = require('express');
const roleController = require('../../controllers/workspace/role.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const checkPermission = require('../../middlewares/permission.middleware');

// mergeParams is set to true to capture brandId from the parent route mount point
const router = express.Router({ mergeParams: true });

router.use(verifyAuth);

router.get('/', roleController.getRoles);
router.post('/', checkPermission('MANAGE_ROLES'), roleController.createRole);
router.put('/:id', checkPermission('MANAGE_ROLES'), roleController.updateRole);
router.delete('/:id', checkPermission('MANAGE_ROLES'), roleController.deleteRole);

module.exports = router;
