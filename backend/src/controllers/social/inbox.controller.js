const inboxService = require('../../services/social/inbox.service');
const asyncHandler = require('../../utils/async-handler');

class InboxController {
  /**
   * GET /api/inbox
   */
  getInboxItems = asyncHandler(async (req, res) => {
    const brandId = req.query.brandId || 'default-brand';
    const result = await inboxService.getInboxItems(req.query, brandId);

    res.status(200).json({
      message: 'Inbox items retrieved successfully',
      ...result
    });
  });

  /**
   * GET /api/inbox/:id
   */
  getConversationThread = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await inboxService.getConversationThread(id);

    res.status(200).json({
      message: 'Thread retrieved successfully',
      ...result
    });
  });

  /**
   * POST /api/inbox/sync
   */
  syncInbox = asyncHandler(async (req, res) => {
    const { brandId, platform } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const result = await inboxService.syncPlatformComments(brandId, platform);
    res.json({ message: 'Sync completed', data: result });
  });

  /**
   * POST /api/inbox/reply
   */
  replyToItem = asyncHandler(async (req, res) => {
    const { brandId, itemId, text } = req.body;
    if (!brandId || !itemId || !text) {
      return res.status(400).json({ message: 'brandId, itemId, and text are required' });
    }

    const result = await inboxService.replyToItem(brandId, itemId, text);
    res.json({ message: 'Reply sent', data: result });
  });

  /**
   * PATCH /api/inbox/:id/status
   */
  updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[InboxController] Updating status for ${id} to ${status}`);
    
    if (!status) return res.status(400).json({ message: 'status is required' });

    const result = await inboxService.updateItemStatus(id, status);
    res.json({ message: 'Status updated', data: result });
  });
}

module.exports = new InboxController();
