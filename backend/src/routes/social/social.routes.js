const express = require('express');
const socialController = require('../../controllers/social/social.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

// YouTube OAuth
router.get('/google/url', verifyAuth, socialController.getGoogleAuthUrl);
router.get('/google/callback', socialController.googleCallback);

// Facebook OAuth
router.get('/facebook/url', verifyAuth, socialController.getFacebookAuthUrl);
router.get('/facebook/callback', socialController.facebookCallback);
router.get('/facebook/published-posts', verifyAuth, socialController.getFacebookPublishedPosts);
router.post('/facebook/disconnect', verifyAuth, socialController.disconnectFacebookAccount);

// Real-time Metrics
router.get('/metrics', verifyAuth, socialController.getMetrics);

// YouTube Tracked Videos
router.post('/youtube/track', verifyAuth, socialController.trackYouTubeVideo);
router.get('/youtube/tracked-videos', verifyAuth, socialController.getTrackedVideos);
router.get('/youtube/published-videos', verifyAuth, socialController.getYouTubePublishedVideos);
router.get('/youtube/video-analytics', verifyAuth, socialController.getYouTubeVideoAnalytics);
router.get('/youtube/playlists', verifyAuth, socialController.getYouTubePlaylists);

// YouTube Competitors
router.get('/youtube/search-channels', verifyAuth, socialController.searchYouTubeChannels);
router.post('/youtube/competitors', verifyAuth, socialController.addYouTubeCompetitor);
router.get('/youtube/competitors', verifyAuth, socialController.getYouTubeCompetitors);

// Google Drive
router.get('/google/drive/files', verifyAuth, socialController.getGoogleDriveFiles);
router.post('/google/drive/download', verifyAuth, socialController.downloadGoogleDriveFile);
router.post('/google/disconnect', verifyAuth, socialController.disconnectGoogleAccount);

module.exports = router;
