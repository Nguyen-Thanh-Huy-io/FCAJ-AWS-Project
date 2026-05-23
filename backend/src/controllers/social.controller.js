const googleOAuthService = require('../services/google-oauth.service');
const youtubeService = require('../services/youtube.service');
const socialAccountRepository = require('../repositories/social-account.repository');

class SocialController {
  async getGoogleAuthUrl(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ];
      const redirectUri = `${req.protocol}://${req.get('host')}/api/social/google/callback`;
      const url = googleOAuthService.getAuthUrl(scopes, brandId, redirectUri);
      res.json({ url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async googleCallback(req, res) {
    const { code, state } = req.query; 
    const brandId = state; 
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/google/callback`;

    if (!brandId) {
      return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);
    }

    try {
      await youtubeService.connectChannel(brandId, code, redirectUri);
      res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=youtube_connected`);
    } catch (error) {
      res.redirect(`${frontendUrl}/manage/connections?error=${encodeURIComponent(error.message)}`);
    }
  }

  async getMetrics(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      // Find all social accounts for this brand
      const accounts = await socialAccountRepository.findByBrandAndPlatform(brandId, 'YOUTUBE');
      
      // For each account, sync metrics
      const syncedAccounts = await Promise.all(accounts.map(async (account) => {
        try {
          return await youtubeService.syncChannelMetrics(account.id);
        } catch (error) {
          console.error(`Failed to sync metrics for account ${account.id}:`, error.message);
          return account; // Return current data if sync fails
        }
      }));

      res.json({
        message: 'Metrics synced successfully',
        data: syncedAccounts
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SocialController();
