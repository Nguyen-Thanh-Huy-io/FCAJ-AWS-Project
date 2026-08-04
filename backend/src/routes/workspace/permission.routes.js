const express = require('express');
const permissionController = require('../../controllers/workspace/permission.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

router.get('/', permissionController.getPermissions);
router.post('/', permissionController.createPermission);
router.delete('/:key', permissionController.deletePermission);

module.exports = router;
