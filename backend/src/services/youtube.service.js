const { google } = require('googleapis');
const googleOAuthService = require('./google-oauth.service');
const socialAccountRepository = require('../repositories/social-account.repository');

class YouTubeService {
  async getChannelInfo(auth) {
    const youtube = google.youtube({ version: 'v3', auth });
    const response = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No YouTube channel found for this account');
    }

    const channel = response.data.items[0];
    
    // Fetch detailed analytics if needed
    const analyticsData = await this.getAnalyticsReport(auth);

    return {
      channelId: channel.id,
      username: channel.snippet.customUrl || channel.snippet.title,
      displayName: channel.snippet.title,
      profilePictureUrl: channel.snippet.thumbnails.default.url,
      statistics: channel.statistics,
      snippet: channel.snippet,
      analytics: analyticsData
    };
  }

  async getAnalyticsReport(auth) {
    try {
      const analytics = google.youtubeanalytics({ version: 'v2', auth });
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // 1. Demographics (Gender/Age)
      const demoRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup,gender',
        sort: 'ageGroup,gender'
      });

      // 2. Traffic Source
      const trafficRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceType',
        sort: '-views'
      });

      // 3. Geographic (Countries)
      const geoRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views',
        dimensions: 'country',
        sort: '-views',
        maxResults: 10
      });

      // 4. Daily Growth (Views, Subscribers)
      const growthRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
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

  async syncChannelMetrics(socialAccountId) {
    const account = await socialAccountRepository.findById(socialAccountId);
    if (!account || account.platform !== 'YOUTUBE') {
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
          refresh_token: account.refreshToken // Keep existing refresh token
        });
      }
    });

    const channelData = await this.getChannelInfo(client);
    
    return socialAccountRepository.upsertYouTubeAccount(account.brandId, channelData, {
      access_token: client.credentials.access_token,
      refresh_token: client.credentials.refresh_token,
      expiry_date: client.credentials.expiry_date
    });
  }
}

module.exports = new YouTubeService();
