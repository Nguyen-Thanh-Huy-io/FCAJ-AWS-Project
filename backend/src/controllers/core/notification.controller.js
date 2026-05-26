const notificationService = require('../../services/core/notification.service');
const asyncHandler = require('../../utils/async-handler');

class NotificationController {
  getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const brandId = req.query.brandId || null;
    const result = await notificationService.getNotifications(req.query, userId, brandId);

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      ...result
    });
  });

  markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await notificationService.markAsRead(id);
    res.status(200).json({ message: 'Notification marked as read' });
  });

  markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const brandId = req.query.brandId || null;
    await notificationService.markAllAsRead(userId, brandId);
    res.status(200).json({ message: 'All notifications marked as read' });
  });
}

module.exports = new NotificationController();
