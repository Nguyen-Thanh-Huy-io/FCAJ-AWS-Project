const express = require('express');
const socialController = require('../controllers/social.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// YouTube OAuth
router.get('/google/url', verifyAuth, socialController.getGoogleAuthUrl);
router.get('/google/callback', socialController.googleCallback);

// Real-time Metrics
router.get('/metrics', verifyAuth, socialController.getMetrics);

module.exports = router;
