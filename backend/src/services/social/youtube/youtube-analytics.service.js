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
      console.log(`--- ENTERING getAnalyticsReport: start=${startDate}, end=${endDate} ---`);
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

      const growthRes = await youtubeGateway.getAnalyticsReportQuery(auth, {
        ids: 'channel==MINE',
        startDate: start,
        endDate: end,
        metrics: 'views,subscribersGained,subscribersLost',
        dimensions: 'day',
        sort: 'day'
      });

      // 5. Fetch ALL types of uploads (Videos, Shorts, Live) using search
      const videosPerDay = {};
      try {
        const searchRes = await youtubeGateway.getSearchList(auth, {
          forMine: true,
          type: 'video',
          publishedAfter: new Date(start).toISOString(),
          publishedBefore: new Date(new Date(end).getTime() + 24*60*60*1000).toISOString(),
          maxResults: 50
        });

        if (searchRes.data.items) {
          console.log('================================================================');
          console.log(`RAW DATA (Search): Found ${searchRes.data.items.length} items from YouTube API`);
          
          searchRes.data.items.forEach((item, index) => {
            const title = item.snippet.title;
            const publishedAt = item.snippet.publishedAt;
            
            if (publishedAt) {
              const pubDate = new Date(publishedAt);
              // Use local date string (YYYY-MM-DD)
              const dateStr = pubDate.toLocaleDateString('en-CA'); 
              
              console.log(`[${index + 1}] ITEM: "${title}"`);
              console.log(`    - Original Time: ${publishedAt}`);
              console.log(`    - Local Date:    ${dateStr}`);
              
              if (dateStr >= start && dateStr <= end) {
                console.log(`    => STATUS: IN RANGE (Accepted)`);
                videosPerDay[dateStr] = (videosPerDay[dateStr] || 0) + 1;
              } else {
                console.log(`    => STATUS: OUT OF RANGE`);
              }
            }
          });
          console.log('================================================================');
        }
      } catch (searchErr) {
        console.error('Error fetching videos via search:', searchErr.message);
        // Fallback to playlist logic if search fails (quota issues etc)
        const channelRes = await youtubeGateway.getChannelList(auth, true);
        const uploadsPlaylistId = channelRes.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (uploadsPlaylistId) {
          const playlistRes = await youtubeGateway.getPlaylistItems(auth, uploadsPlaylistId, 50);
          if (playlistRes.data.items) {
            playlistRes.data.items.forEach(item => {
              const publishedAt = item.contentDetails?.videoPublishedAt || item.snippet.publishedAt;
              if (publishedAt) {
                const dateStr = new Date(publishedAt).toLocaleDateString('en-CA');
                if (dateStr >= start && dateStr <= end) {
                  videosPerDay[dateStr] = (videosPerDay[dateStr] || 0) + 1;
                }
              }
            });
          }
        }
      }

      // 6. Merge and ensure all days are present
      const dailyMap = {};
      const startMs = new Date(start + 'T00:00:00Z').getTime();
      const endMs = new Date(end + 'T00:00:00Z').getTime();
      for (let t = startMs; t <= endMs; t += 24 * 60 * 60 * 1000) {
        const d = new Date(t).toISOString().split('T')[0];
        dailyMap[d] = {
          date: d,
          views: 0,
          subscribersGained: 0,
          subscribersLost: 0,
          totalContent: videosPerDay[d] || 0
        };
      }

      if (growthRes.data.rows) {
        growthRes.data.rows.forEach(row => {
          const d = row[0];
          if (dailyMap[d]) {
            dailyMap[d].views = row[1];
            dailyMap[d].subscribersGained = row[2];
            dailyMap[d].subscribersLost = row[3];
          }
        });
      }

      const growthData = Object.keys(dailyMap).sort().map(d => dailyMap[d]);

      return {
        demographics: demoRes.data.rows || [],
        trafficSource: trafficRes.data.rows || [],
        geographic: geoRes.data.rows || [],
        growth: growthData
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
    const competitors = await competitorRepository.getCompetitors(brandId, PLATFORMS.YOUTUBE);
    if (!competitors || competitors.length === 0) return [];

    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) return competitors;

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    // Enrich each competitor with YouTube API data
    const enrichedCompetitors = await Promise.all(competitors.map(async (comp) => {
      try {
        const channelRes = await youtubeGateway.getChannelList(auth, false, comp.competitorHandle);
        if (!channelRes.data.items || channelRes.data.items.length === 0) {
          return {
            ...comp,
            totalViews: 0,
            totalVideos: 0,
            latestVideos: []
          };
        }

        const channel = channelRes.data.items[0];
        const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
        const totalViews = parseInt(channel.statistics?.viewCount) || 0;
        const totalVideos = parseInt(channel.statistics?.videoCount) || 0;
        const followersCount = parseInt(channel.statistics?.subscriberCount) || 0;

        let latestVideos = [];
        if (uploadsPlaylistId) {
          const playlistRes = await youtubeGateway.getPlaylistItems(auth, uploadsPlaylistId, 5);
          if (playlistRes.data.items && playlistRes.data.items.length > 0) {
            const videoIds = playlistRes.data.items.map(item => item.contentDetails.videoId).join(',');
            const videoDetails = await youtubeGateway.getVideosList(auth, videoIds);
            latestVideos = videoDetails.data.items.map(v => ({
              id: v.id,
              title: v.snippet.title,
              thumbnailUrl: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default.url,
              publishedAt: v.snippet.publishedAt,
              views: parseInt(v.statistics.viewCount) || 0,
              likes: parseInt(v.statistics.likeCount) || 0,
              comments: parseInt(v.statistics.commentCount) || 0,
            }));
          }
        }

        return {
          ...comp,
          followersCount,
          totalViews,
          totalVideos,
          latestVideos
        };
      } catch (err) {
        console.error(`Failed to enrich competitor ${comp.competitorHandle}:`, err.message);
        return {
          ...comp,
          totalViews: 0,
          totalVideos: 0,
          latestVideos: []
        };
      }
    }));

    return enrichedCompetitors;
  }

  async getVideoAnalytics(brandId, videoId, startDate, endDate) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const now = new Date();
    const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEnd = now.toISOString().split('T')[0];

    const start = startDate || defaultStart;
    const end = endDate || defaultEnd;

    const response = await youtubeGateway.getAnalyticsReportQuery(auth, {
      ids: 'channel==MINE',
      startDate: start,
      endDate: end,
      metrics: 'views,likes,comments,averageViewDuration',
      dimensions: 'day',
      filters: `video==${videoId}`,
      sort: 'day'
    });

    return response.data.rows?.map(row => ({
      date: row[0],
      views: row[1],
      likes: row[2],
      comments: row[3],
      avgWatchTime: row[4]
    })) || [];
  }
}

module.exports = new YouTubeAnalyticsService();
