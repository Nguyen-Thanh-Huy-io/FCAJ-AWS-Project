const googleOAuthService = require('../../services/social/google-oauth.service');
const youtubeService = require('../../services/social/youtube');
const socialAccountRepository = require('../../repositories/social/social-account.repository');
const googleDriveService = require('../../services/social/google-drive.service');
const prisma = require('../../config/prisma');

class SocialController {
  async getGoogleAuthUrl(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

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
      const { brandId, startDate, endDate } = req.query;
      console.log('--- SocialController.getMetrics ---');
      console.log('brandId:', brandId);
      console.log('startDate:', startDate, 'endDate:', endDate);
      
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      const socialPlatformFactory = require('../../services/social/social-platform.factory');

      // Find all social accounts for this brand
      const accounts = await prisma.socialAccount.findMany({
        where: { brandId },
        include: {
          youtubeChannel: true,
          facebookPage: true,
          analytics: {
            orderBy: { fetchedAt: 'desc' },
            take: 1,
            include: {
              socialAnalytics: true
            }
          }
        }
      });
      
      console.log('Accounts found:', accounts.map(a => ({ id: a.id, platform: a.platform, displayName: a.displayName })));
      
      // For each account, sync metrics polymorphically
      const syncedAccounts = await Promise.all(accounts.map(async (account) => {
        try {
          console.log(`Syncing channel metrics for ${account.platform} (Account: ${account.id})...`);
          const service = socialPlatformFactory.getService(account.platform);
          const result = await service.syncChannelMetrics(account.id, startDate, endDate);
          console.log(`Successfully synced ${account.platform}.`);
          return result;
        } catch (error) {
          console.error(`Failed to sync metrics for account ${account.id} (${account.platform}):`, error);
          return account; // Return current data if sync fails
        }
      }));

      res.json({
        message: 'Metrics synced successfully',
        data: syncedAccounts
      });
    } catch (error) {
      console.error('Error in SocialController.getMetrics:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async trackYouTubeVideo(req, res) {
    try {
      const { brandId, videoUrl } = req.body;
      const trackedVideo = await youtubeService.trackVideo(brandId, videoUrl);
      res.json({ message: 'Video tracked successfully', data: trackedVideo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTrackedVideos(req, res) {
    try {
      const { brandId } = req.query;
      const videos = await youtubeService.getTrackedVideos(brandId);
      res.json({ data: videos });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getYouTubePublishedVideos(req, res) {
    try {
      const { brandId, pageToken, limit } = req.query;
      const data = await youtubeService.getPublishedVideos(brandId, pageToken, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getYouTubeVideoAnalytics(req, res) {
    try {
      const { brandId, videoId, startDate, endDate } = req.query;
      if (!videoId) return res.status(400).json({ message: 'videoId is required' });
      
      const data = await youtubeService.getVideoAnalytics(brandId, videoId, startDate, endDate);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchYouTubeChannels(req, res) {
    try {
      const { brandId, query } = req.query;
      const channels = await youtubeService.searchChannel(brandId, query);
      res.json({ data: channels });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addYouTubeCompetitor(req, res) {
    try {
      const { brandId, channelId } = req.body;
      const competitor = await youtubeService.addCompetitor(brandId, channelId);
      res.json({ message: 'Competitor added successfully', data: competitor });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getYouTubeCompetitors(req, res) {
    try {
      const { brandId } = req.query;
      const competitors = await youtubeService.getCompetitors(brandId);
      res.json({ data: competitors });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getYouTubePlaylists(req, res) {
    try {
      const { brandId, sync } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }
      const forceRefresh = sync === 'true' || sync === true;
      const playlists = await youtubeService.getPlaylists(brandId, forceRefresh);
      res.json({ data: playlists });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getGoogleDriveFiles(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      const files = await googleDriveService.listVideos(brandId);
      
      const socialAccount = await prisma.socialAccount.findFirst({
        where: {
          brandId,
          platform: 'YOUTUBE'
        }
      });

      res.json({ 
        connected: true, 
        data: files,
        account: socialAccount ? {
          displayName: socialAccount.displayName,
          username: socialAccount.username,
          profilePictureUrl: socialAccount.profilePictureUrl
        } : null
      });
    } catch (error) {
      if (error.code === 'NOT_CONNECTED') {
        return res.json({ connected: false, data: [], account: null });
      }
      res.status(500).json({ message: error.message });
    }
  }

  async downloadGoogleDriveFile(req, res) {
    try {
      const { brandId, fileId, fileName } = req.body;
      if (!brandId || !fileId || !fileName) {
        return res.status(400).json({ message: 'brandId, fileId, and fileName are required' });
      }

      const localPath = await googleDriveService.downloadFile(brandId, fileId, fileName);
      res.json({ videoUrl: localPath });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async disconnectGoogleAccount(req, res) {
    try {
      const { brandId } = req.body;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      await prisma.socialAccount.deleteMany({
        where: {
          brandId,
          platform: 'YOUTUBE'
        }
      });

      res.json({ success: true, message: 'Google account disconnected successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFacebookAuthUrl(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }
      const appId = process.env.FACEBOOK_APP_ID;
      const redirectUri = `${req.protocol}://${req.get('host')}/api/social/facebook/callback`;
      const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${brandId}&scope=pages_show_list,pages_read_engagement,pages_read_user_content,read_insights,pages_manage_engagement`;
      res.json({ url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async facebookCallback(req, res) {
    const { code, state } = req.query;
    const brandId = state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUri = `${req.protocol}://${req.get('host')}/api/social/facebook/callback`;

    if (!brandId) {
      return res.redirect(`${frontendUrl}/manage/connections?error=brand_id_missing`);
    }

    try {
      const facebookService = require('../../services/social/facebook');
      await facebookService.connectChannel(brandId, code, redirectUri);
      res.redirect(`${frontendUrl}/manage/connections?tab=connections&success=facebook_connected`);
    } catch (error) {
      res.redirect(`${frontendUrl}/manage/connections?error=${encodeURIComponent(error.message)}`);
    }
  }

  async getFacebookPublishedPosts(req, res) {
    try {
      const { brandId, limit } = req.query;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }
      const facebookService = require('../../services/social/facebook');
      const data = await facebookService.getPublishedVideos(brandId, null, limit ? parseInt(limit) : 10);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async disconnectFacebookAccount(req, res) {
    try {
      const { brandId } = req.body;
      if (!brandId) {
        return res.status(400).json({ message: 'brandId is required' });
      }

      await prisma.socialAccount.deleteMany({
        where: {
          brandId,
          platform: 'FACEBOOK'
        }
      });

      res.json({ success: true, message: 'Facebook page disconnected successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SocialController();
