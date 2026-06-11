const googleOAuthService = require('../../services/social/google-oauth.service');
const youtubeService = require('../../services/social/youtube');
const facebookService = require('../../services/social/facebook');
const tiktokService = require('../../services/social/tiktok');
const tiktokGateway = require('../../services/social/tiktok/tiktok.gateway');
const { SOCIAL_TECHNICAL } = require('../../utils/constants');
const asyncHandler = require('../../utils/async-handler');
const logger = require('../../utils/logger');

class OAuthController {
  /**
   * Helper to get base URL for redirect URIs (supports ngrok)
   */
  _getRedirectBaseUrl(req) {
    return process.env.BACKEND_BASE_URL || `${req.protocol}://${req.get('host')}`;
  }

  getGoogleAuthUrl = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const scopes = [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive.readonly'
    ];
    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/google/callback`;
    const url = googleOAuthService.getAuthUrl(scopes, brandId, redirectUri);
    res.json({ url });
  });

  _handleCallbackError(error, frontendUrl, res) {
    if (error.name === 'ConnectionConflictError') {
      const queryParams = new URLSearchParams({
        error: 'social_connection_conflict',
        conflictType: error.type,
        channelName: error.channelName,
        platformAccountId: error.platformAccountId,
        platform: error.platform,
        existingBrandName: error.existingBrandName || ''
      }).toString();
      return res.redirect(`${frontendUrl}/manage/connections?${queryParams}`);
    }
    logger.error('Social OAuth Connection Error:', error);
    return res.redirect(`${frontendUrl}/manage/connections?error=connection_failed`);
  }

  googleCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const brandId = state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/google/callback`;

    if (!brandId) return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);

    try {
      await youtubeService.connectChannel(brandId, code, redirectUri);
      return res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=youtube_connected`);
    } catch (error) {
      return this._handleCallbackError(error, frontendUrl, res);
    }
  });

  getFacebookAuthUrl = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/facebook/callback`;
    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${brandId}&scope=pages_show_list,pages_read_engagement,pages_read_user_content,read_insights,pages_manage_engagement`;
    res.json({ url });
  });

  facebookCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const brandId = state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/facebook/callback`;

    if (!brandId) return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);

    try {
      await facebookService.connectChannel(brandId, code, redirectUri);
      return res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=facebook_connected`);
    } catch (error) {
      return this._handleCallbackError(error, frontendUrl, res);
    }
  });

  getTikTokAuthUrl = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/tiktok/callback`;
    logger.debug('[TikTok OAuth] Constructing auth URL', { redirectUri });

    const url = tiktokGateway.getAuthUrl(SOCIAL_TECHNICAL.TIKTOK_SCOPES, brandId, redirectUri);
    res.json({ url });
  });

  tiktokCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const brandId = state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${this._getRedirectBaseUrl(req)}/api/social/tiktok/callback`;

    if (!brandId) return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);

    try {
      await tiktokService.connectChannel(brandId, code, redirectUri);
      return res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=tiktok_connected`);
    } catch (error) {
      return this._handleCallbackError(error, frontendUrl, res);
    }
  });

  handleTikTokWebhook = asyncHandler(async (req, res) => {
    const challenge = req.query.challenge || req.body.challenge;

    if (challenge) {
      logger.debug('[TikTok Webhook] Verification challenge received');
      return res.status(200).send(challenge);
    }

    logger.info('[TikTok Webhook] Event received', { type: req.body?.type || 'unknown' });
    res.status(200).json({ status: 'ok' });
  });
}

module.exports = new OAuthController();

