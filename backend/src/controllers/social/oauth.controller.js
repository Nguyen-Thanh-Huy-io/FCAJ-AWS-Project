const googleOAuthService = require('../../services/social/google-oauth.service');
const youtubeService = require('../../services/social/youtube');
const facebookService = require('../../services/social/facebook');
const asyncHandler = require('../../utils/async-handler');

class OAuthController {
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
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/google/callback`;
    const url = googleOAuthService.getAuthUrl(scopes, brandId, redirectUri);
    res.json({ url });
  });

  googleCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query; 
    const brandId = state; 
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/google/callback`;

    if (!brandId) return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);

    await youtubeService.connectChannel(brandId, code, redirectUri);
    res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=youtube_connected`);
  });

  getFacebookAuthUrl = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/facebook/callback`;
    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${brandId}&scope=pages_show_list,pages_read_engagement,pages_read_user_content,read_insights,pages_manage_engagement`;
    res.json({ url });
  });

  facebookCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const brandId = state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/facebook/callback`;

    if (!brandId) return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);

    await facebookService.connectChannel(brandId, code, redirectUri);
    res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=facebook_connected`);
  });
}

module.exports = new OAuthController();
