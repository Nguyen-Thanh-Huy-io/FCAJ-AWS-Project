const notificationService = require('../services/notification.service');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const brandId = req.query.brandId || null;
      const result = await notificationService.getNotifications(req.query, userId, brandId);

      res.status(200).json({
        message: 'Notifications retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const brandId = req.query.brandId || null;
      await notificationService.markAllAsRead(userId, brandId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NotificationController();
