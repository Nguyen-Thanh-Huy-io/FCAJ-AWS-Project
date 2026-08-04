const express = require('express');
const platformLimitController = require('../../controllers/admin/platform-limit.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/authorization.middleware');
const { USER_ROLES } = require('../../utils/constants');

const router = express.Router();

// Apply authentication and ADMIN/OWNER authorization to all routes
router.use(verifyAuth);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OWNER));

/**
 * GET /api/admin/platform-limits
 */
router.get('/', platformLimitController.getPlatformLimits);

/**
 * GET /api/admin/platform-limits/:id
 */
router.get('/:id', platformLimitController.getPlatformLimitById);

/**
 * POST /api/admin/platform-limits
 */
router.post('/', platformLimitController.createPlatformLimit);

/**
 * PUT /api/admin/platform-limits/:id
 */
router.put('/:id', platformLimitController.updatePlatformLimit);

/**
 * DELETE /api/admin/platform-limits/:id
 */
router.delete('/:id', platformLimitController.deletePlatformLimit);

module.exports = router;
