const express = require('express');
const adAccountController = require('../../controllers/workspace/ad-account.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyAuth);

/**
 * GET /api/ad-accounts/performance
 * Get all connected ad accounts and aggregated analytics
 */
router.get('/performance', adAccountController.getAdPerformanceData);

/**
 * POST /api/ad-accounts/campaigns/toggle
 * Toggle campaign state (Active/Paused)
 */
router.post('/campaigns/toggle', adAccountController.toggleCampaignStatus);

/**
 * POST /api/ad-accounts/connect
 * Connect/Link a new simulated ad account
 */
router.post('/connect', adAccountController.connectAdAccount);

module.exports = router;
