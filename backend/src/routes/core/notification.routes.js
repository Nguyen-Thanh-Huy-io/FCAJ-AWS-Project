const express = require('express');
const notificationController = require('../../controllers/core/notification.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

/**
 * GET /api/notifications
 */
router.get('/', notificationController.getNotifications);

/**
 * POST /api/notifications/:id/read
 */
router.post('/:id/read', notificationController.markAsRead);

/**
 * POST /api/notifications/read-all
 */
router.post('/read-all', notificationController.markAllAsRead);

module.exports = router;
