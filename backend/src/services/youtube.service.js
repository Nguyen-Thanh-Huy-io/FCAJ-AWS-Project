const { google } = require('googleapis');
const googleOAuthService = require('./google-oauth.service');
const socialAccountRepository = require('../repositories/social-account.repository');
const prisma = require('../config/prisma');

class YouTubeService {
  async getChannelInfo(auth, startDate, endDate) {
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

  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, 'YOUTUBE');
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const account = socialAccount[0];
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: account.accessToken });

    const youtube = google.youtube({ version: 'v3', auth });
    
    let uploadsId = account.youtubeChannel?.uploadsPlaylistId;
    if (!uploadsId) {
      const channelRes = await youtube.channels.list({ part: 'contentDetails', mine: true });
      uploadsId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;
    }

    const playlistRes = await youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId: uploadsId,
      maxResults: parseInt(limit) || 10,
      pageToken: pageToken
    });

    if (!playlistRes.data.items || playlistRes.data.items.length === 0) {
      return { videos: [], nextPageToken: null, prevPageToken: null };
    }

    const videoIds = playlistRes.data.items.map(item => item.contentDetails.videoId).join(',');

    const videoDetails = await youtube.videos.list({
      part: 'statistics,contentDetails,snippet',
      id: videoIds
    });

    const videos = videoDetails.data.items.map(v => ({
      id: v.id,
      title: v.snippet.title,
      thumbnailUrl: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default.url,
      publishedAt: v.snippet.publishedAt,
      views: v.statistics.viewCount,
      likes: v.statistics.likeCount,
      comments: v.statistics.commentCount,
      duration: v.contentDetails.duration,
      status: 'Published'
    }));

    return {
      videos,
      nextPageToken: playlistRes.data.nextPageToken,
      prevPageToken: playlistRes.data.prevPageToken
    };
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    try {
      const analytics = google.youtubeAnalytics({ version: 'v2', auth });
      const now = new Date();
      const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEnd = now.toISOString().split('T')[0];

      const start = startDate || defaultStart;
      const end = endDate || defaultEnd;

      // 1. Demographics (Gender/Age)
      const demoRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup,gender',
        sort: 'ageGroup,gender'
      });

      // 2. Traffic Source
      const trafficRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceType',
        sort: '-views'
      });

      // 3. Geographic (Countries)
      const geoRes = await analytics.reports.query({
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views',
        dimensions: 'country',
        sort: '-views',
        maxResults: 10
      });

      // 4. Daily Growth (Views, Subscribers)
      const growthRes = await analytics.reports.query({
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

    const channelData = await this.getChannelInfo(client, startDate, endDate);
    
    return socialAccountRepository.upsertYouTubeAccount(account.brandId, channelData, {
      access_token: client.credentials.access_token,
      refresh_token: client.credentials.refresh_token,
      expiry_date: client.credentials.expiry_date
    });
  }

  async trackVideo(brandId, videoUrl) {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, 'YOUTUBE');
    if (!socialAccount || socialAccount.length === 0) {
      throw new Error('Please connect a YouTube account first to track videos');
    }

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const youtube = google.youtube({ version: 'v3', auth });
    const response = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return prisma.trackedVideo.upsert({
      where: { brandId_videoId: { brandId, videoId } },
      update: {
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
        lastViews: parseInt(video.statistics.viewCount) || 0,
        lastLikes: parseInt(video.statistics.likeCount) || 0,
        lastComments: parseInt(video.statistics.commentCount) || 0,
        lastSyncedAt: new Date()
      },
      create: {
        brandId,
        videoId,
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
        channelId: video.snippet.channelId,
        channelName: video.snippet.channelTitle,
        publishedAt: new Date(video.snippet.publishedAt),
        lastViews: parseInt(video.statistics.viewCount) || 0,
        lastLikes: parseInt(video.statistics.likeCount) || 0,
        lastComments: parseInt(video.statistics.commentCount) || 0,
        lastSyncedAt: new Date()
      }
    });
  }

  async getTrackedVideos(brandId) {
    return prisma.trackedVideo.findMany({
      where: { brandId },
      orderBy: { addedAt: 'desc' }
    });
  }

  async searchChannel(brandId, query) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, 'YOUTUBE');
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const youtube = google.youtube({ version: 'v3', auth });
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'channel',
      maxResults: 5
    });

    return response.data.items.map(item => ({
      channelId: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  }

  async addCompetitor(brandId, channelId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, 'YOUTUBE');
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const youtube = google.youtube({ version: 'v3', auth });
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      id: channelId
    });

    if (!response.data.items || response.data.items.length === 0) throw new Error('Channel not found');

    const channel = response.data.items[0];
    return prisma.competitorAnalysis.create({
      data: {
        brandId,
        platform: 'YOUTUBE',
        competitorHandle: channel.snippet.customUrl || channel.id,
        competitorDisplayName: channel.snippet.title,
        competitorAvatarUrl: channel.snippet.thumbnails.default.url,
        followersCount: parseInt(channel.statistics.subscriberCount) || 0,
        addedAt: new Date()
      }
    });
  }

  async getCompetitors(brandId) {
    return prisma.competitorAnalysis.findMany({
      where: { brandId, platform: 'YOUTUBE' },
      orderBy: { addedAt: 'desc' }
    });
  }

  extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

module.exports = new YouTubeService();
