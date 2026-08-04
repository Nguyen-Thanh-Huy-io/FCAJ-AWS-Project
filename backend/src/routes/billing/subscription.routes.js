const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../../middlewares/auth.middleware');
const subscriptionController = require('../../controllers/billing/subscription.controller');

/**
 * Subscription Routes
 * All routes require user to be authenticated (verifyAuth)
 * Plan limit checks are applied at the feature-level routes (brands, posts, etc.)
 */

// POST /api/billing/subscriptions/initiate
// User clicks "Upgrade" → server creates QR, returns payment data
router.post('/initiate', verifyAuth, subscriptionController.initiatePayment);

// GET /api/billing/subscriptions/status/:transactionCode
// Frontend polls every 3s to check if SePay confirmed the payment
router.get('/status/:transactionCode', verifyAuth, subscriptionController.checkPaymentStatus);

// GET /api/billing/subscriptions/current?brandId=xxx
// Get current plan info for a brand (for Settings/Pricing page)
router.get('/current', verifyAuth, subscriptionController.getCurrentPlan);

// GET /api/billing/subscriptions/addons
// Get list of all available addons
router.get('/addons', verifyAuth, subscriptionController.getActiveAddons);

// POST /api/billing/subscriptions/addons/initiate
// Buy an addon
router.post('/addons/initiate', verifyAuth, subscriptionController.initiateAddonPayment);

module.exports = router;
