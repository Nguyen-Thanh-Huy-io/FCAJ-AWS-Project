const express = require('express');
const oauthController = require('../../controllers/social/oauth.controller');
const youtubeController = require('../../controllers/social/youtube.controller');
const facebookController = require('../../controllers/social/facebook.controller');
const tiktokController = require('../../controllers/social/tiktok.controller');
const googleDriveController = require('../../controllers/social/google-drive.controller');
const socialAnalyticsController = require('../../controllers/social/social-analytics.controller');
const socialConnectionController = require('../../controllers/social/social-connection.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// OAuth
router.get('/google/url', verifyAuth, oauthController.getGoogleAuthUrl);
router.get('/google/callback', oauthController.googleCallback);
router.get('/facebook/url', verifyAuth, oauthController.getFacebookAuthUrl);
router.get('/facebook/callback', oauthController.facebookCallback);
router.get('/tiktok/url', verifyAuth, oauthController.getTikTokAuthUrl);
router.get('/tiktok/callback', oauthController.tiktokCallback);
router.get('/tiktok/webhook', oauthController.handleTikTokWebhook);
router.post('/tiktok/webhook', oauthController.handleTikTokWebhook);

// Facebook Features
router.get('/facebook/published-posts', verifyAuth, facebookController.getFacebookPublishedPosts);
router.post('/facebook/disconnect', verifyAuth, socialConnectionController.disconnectFacebookAccount);
router.post('/tiktok/disconnect', verifyAuth, socialConnectionController.disconnectTikTokAccount);
router.post('/reassign', verifyAuth, socialConnectionController.reassignSocialAccount);
router.get('/tiktok/published-videos', verifyAuth, tiktokController.getTikTokPublishedVideos);

// Real-time Metrics
router.get('/metrics', verifyAuth, socialAnalyticsController.getMetrics);

// YouTube Tracked Videos
router.post('/youtube/track', verifyAuth, youtubeController.trackYouTubeVideo);
router.get('/youtube/tracked-videos', verifyAuth, youtubeController.getTrackedVideos);
router.get('/youtube/published-videos', verifyAuth, youtubeController.getYouTubePublishedVideos);
router.get('/youtube/video-analytics', verifyAuth, youtubeController.getYouTubeVideoAnalytics);
router.get('/youtube/playlists', verifyAuth, youtubeController.getYouTubePlaylists);

// YouTube Competitors
router.get('/youtube/search-channels', verifyAuth, youtubeController.searchYouTubeChannels);
router.post('/youtube/competitors', verifyAuth, youtubeController.addYouTubeCompetitor);
router.get('/youtube/competitors', verifyAuth, youtubeController.getYouTubeCompetitors);
router.delete('/youtube/competitors/:id', verifyAuth, youtubeController.deleteYouTubeCompetitor);

// Google Drive
router.get('/google/drive/files', verifyAuth, googleDriveController.getGoogleDriveFiles);
router.post('/google/drive/download', verifyAuth, googleDriveController.downloadGoogleDriveFile);
router.post('/google/disconnect', verifyAuth, socialConnectionController.disconnectGoogleAccount);

module.exports = router;

