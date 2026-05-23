const inboxService = require('../services/inbox.service');

class InboxController {
  /**
   * GET /api/inbox
   */
  async getInboxItems(req, res) {
    try {
      const brandId = req.query.brandId || 'default-brand';
      const result = await inboxService.getInboxItems(req.query, brandId);

      res.status(200).json({
        message: 'Inbox items retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/inbox/:id
   */
  async getConversationThread(req, res) {
    try {
      const { id } = req.params;
      const result = await inboxService.getConversationThread(id);

      res.status(200).json({
        message: 'Thread retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}

module.exports = new InboxController();
