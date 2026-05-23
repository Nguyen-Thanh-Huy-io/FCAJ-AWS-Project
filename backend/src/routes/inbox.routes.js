const express = require('express');
const inboxController = require('../controllers/inbox.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

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

module.exports = router;
