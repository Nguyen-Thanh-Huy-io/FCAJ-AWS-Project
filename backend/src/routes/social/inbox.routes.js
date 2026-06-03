const express = require('express');
const inboxController = require('../../controllers/social/inbox.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyAuth);

/**
 * GET /api/inbox
 */
router.get('/', inboxController.getInboxItems);

/**
 * GET /api/inbox/:id
 */
router.get('/:id', inboxController.getConversationThread);

/**
 * POST /api/inbox/sync
 */
router.post('/sync', inboxController.syncInbox);

/**
 * POST /api/inbox/reply
 */
router.post('/reply', inboxController.replyToItem);

/**
 * PATCH /api/inbox/:id/status
 */
router.patch('/:id/status', inboxController.updateStatus);

/**
 * PATCH /api/inbox/:id/metadata
 */
router.patch('/:id/metadata', inboxController.updateMetadata);

module.exports = router;
