const youtubeGateway = require('./youtube.gateway');
const googleOAuthService = require('../google-oauth.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const competitorRepository = require('../../../repositories/social/competitor.repository');
const { PLATFORMS } = require('../../../utils/constants');

class YouTubeAnalyticsService {
  async getChannelInfo(auth, startDate, endDate) {
    const response = await youtubeGateway.getChannelList(auth, true);

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No YouTube channel found for this account');
    }

    const channel = response.data.items[0];
    
    // Fetch detailed analytics if needed
    const analyticsData = await this.getAnalyticsReport(auth, startDate, endDate);

    return {
      channelId: channel.id,
      username: channel.snippet.customUrl || channel.snippet.title,
      displayName: channel.snippet.title,
      profilePictureUrl: channel.snippet.thumbnails.default.url,
      statistics: channel.statistics,
      snippet: channel.snippet,
      analytics: analyticsData,
      uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads
    };
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    try {
      const now = new Date();
      const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEnd = now.toISOString().split('T')[0];

      const start = startDate || defaultStart;
      const end = endDate || defaultEnd;

      // 1. Demographics (Gender/Age)
      const demoRes = await youtubeGateway.getAnalyticsReportQuery(auth, {
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup,gender',
        sort: 'ageGroup,gender'
      });

      // 2. Traffic Source
      const trafficRes = await youtubeGateway.getAnalyticsReportQuery(auth, {
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceType',
        sort: '-views'
      });

      // 3. Geographic (Countries)
      const geoRes = await youtubeGateway.getAnalyticsReportQuery(auth, {
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views',
        dimensions: 'country',
        sort: '-views',
        maxResults: 10
      });

      // 4. Daily Growth (Views, Subscribers)
      const growthRes = await youtubeGateway.getAnalyticsReportQuery(auth, {
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views,subscribersGained,subscribersLost',
        dimensions: 'day',
        sort: 'day'
      });

      return {
        demographics: demoRes.data.rows || [],
        trafficSource: trafficRes.data.rows || [],
        geographic: geoRes.data.rows || [],
        growth: growthRes.data.rows || []
      };
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error.message);
      return null;
    }
  }

  async connectChannel(brandId, code, redirectUri) {
    const tokens = await googleOAuthService.getTokens(code, redirectUri);
    const client = googleOAuthService.createClient(redirectUri);
    client.setCredentials(tokens);
    
    const channelData = await this.getChannelInfo(client);
    
    return socialAccountRepository.upsertYouTubeAccount(brandId, channelData, tokens);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    const account = await socialAccountRepository.findById(socialAccountId);
    if (!account || account.platform !== PLATFORMS.YOUTUBE) {
      throw new Error('Social account not found or is not a YouTube account');
    }

    const client = googleOAuthService.createClient();
    client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      expiry_date: account.tokenExpiresAt ? account.tokenExpiresAt.getTime() : undefined
    });

    // Check if token is expired and refresh if necessary
    client.on('tokens', async (tokens) => {
      if (tokens.refresh_token) {
        await socialAccountRepository.updateTokens(socialAccountId, tokens);
      } else if (tokens.access_token) {
        await socialAccountRepository.updateTokens(socialAccountId, {
          ...tokens,
          refresh_token: account.refreshToken
        });
      }
    });

    const channelData = await this.getChannelInfo(client, startDate, endDate);
    
    return socialAccountRepository.upsertYouTubeAccount(account.brandId, channelData, {
      access_token: client.credentials.access_token,
      refresh_token: client.credentials.refresh_token,
      expiry_date: client.credentials.expiry_date
    });
  }

  async addCompetitor(brandId, channelId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const response = await youtubeGateway.getChannelList(auth, false, channelId);

    if (!response.data.items || response.data.items.length === 0) throw new Error('Channel not found');

    const channel = response.data.items[0];
    return competitorRepository.createCompetitor(brandId, PLATFORMS.YOUTUBE, {
      competitorHandle: channel.snippet.customUrl || channel.id,
      competitorDisplayName: channel.snippet.title,
      competitorAvatarUrl: channel.snippet.thumbnails.default.url,
      followersCount: parseInt(channel.statistics.subscriberCount) || 0
    });
  }

  async getCompetitors(brandId) {
    return competitorRepository.getCompetitors(brandId, PLATFORMS.YOUTUBE);
  }
}

module.exports = new YouTubeAnalyticsService();
