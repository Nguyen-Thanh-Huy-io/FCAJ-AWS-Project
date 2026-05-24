const inboxService = require('../../services/social/inbox.service');

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

  /**
   * POST /api/inbox/sync
   */
  async syncInbox(req, res) {
    try {
      const { brandId, platform } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });

      const result = await inboxService.syncPlatformComments(brandId, platform);
      res.json({ message: 'Sync completed', data: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * POST /api/inbox/reply
   */
  async replyToItem(req, res) {
    try {
      const { brandId, itemId, text } = req.body;
      if (!brandId || !itemId || !text) {
        return res.status(400).json({ message: 'brandId, itemId, and text are required' });
      }

      const result = await inboxService.replyToItem(brandId, itemId, text);
      res.json({ message: 'Reply sent', data: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/inbox/:id/status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(`[InboxController] Updating status for ${id} to ${status}`);
      
      if (!status) return res.status(400).json({ message: 'status is required' });

      const result = await inboxService.updateItemStatus(id, status);
      res.json({ message: 'Status updated', data: result });
    } catch (error) {
      console.error('[InboxController] Status update error:', error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new InboxController();
