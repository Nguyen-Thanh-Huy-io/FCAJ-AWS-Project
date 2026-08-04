const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/workspace/ticket.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

// Protect all support ticket routes
router.use(verifyAuth);

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.get('/active', ticketController.getActiveTicket);
router.get('/:id', ticketController.getTicketDetails);
router.put('/:id/status', ticketController.updateTicketStatus);
router.put('/:id/assign', ticketController.assignTicket);

module.exports = router;
