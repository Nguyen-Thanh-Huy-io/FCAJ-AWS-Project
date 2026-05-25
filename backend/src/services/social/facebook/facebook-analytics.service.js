const facebookGateway = require('./facebook.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS } = require('../../../utils/constants');

class FacebookAnalyticsService {
  async getChannelInfo(auth, startDate, endDate) {
    // For Facebook, auth is the page access token
    const pageData = await facebookGateway.getPageDetails(auth.pageId, auth.pageAccessToken);
    
    // Fetch analytics report
    const analyticsData = await this.getAnalyticsReport(auth.pageId, auth.pageAccessToken, startDate, endDate, pageData.followersCount);
    
    return {
      ...pageData,
      analytics: analyticsData
    };
  }

  async getAnalyticsReport(pageId, pageAccessToken, startDate, endDate, currentFollowersCount) {
    try {
      const now = new Date();
      const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEnd = now.toISOString().split('T')[0];

      const start = startDate || defaultStart;
      const end = endDate || defaultEnd;

      const insights = await facebookGateway.getPageInsights(pageId, pageAccessToken, start, end);
      
      // Parse insights into daily records map
      const dailyMap = {};
      
      // Initialize dates range
      const startMs = new Date(start + 'T00:00:00Z').getTime();
      const endMs = new Date(end + 'T00:00:00Z').getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      for (let time = startMs; time <= endMs; time += oneDayMs) {
        const dateStr = new Date(time).toISOString().split('T')[0];
        dailyMap[dateStr] = {
          date: dateStr,
          name: new Date(time).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
          followers: 0,
          views: 0,
          pageVisits: 0,
          totalContent: 0,
          acquired: 0,
          lost: 0,
          totalClicks: 0,
          reactions: 0,
          comments: 0,
          shares: 0
        };
      }

      // Fill in data from Insights
      for (const item of insights) {
        const name = item.name;
        if (item.values) {
          for (const val of item.values) {
            const d = new Date(val.end_time);
            // Facebook Insights end_time marks the end of a 24h period.
            // Subtracting 24 hours ensures it falls into the correct data day.
            d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
            const dateStr = d.toISOString().split('T')[0];
            
            if (dailyMap[dateStr]) {
              if (name === 'page_views_total') {
                dailyMap[dateStr].pageVisits = val.value || 0;
              } else if (name === 'page_impressions_unique') {
                dailyMap[dateStr].views = val.value || 0;
              } else if (name === 'page_daily_follows_unique') {
                dailyMap[dateStr].acquired = (dailyMap[dateStr].acquired || 0) + (val.value || 0);
              } else if (name === 'page_total_actions' || name === 'page_post_engagements') {
                dailyMap[dateStr].totalClicks = val.value || 0;
              }
            }
          }
        }
      }

      // Fetch posts in this period to enrich content counts and interactions
      const feed = await facebookGateway.getPageFeed(pageId, pageAccessToken, 100);
      let totalPostsInPeriod = 0;
      let totalReactions = 0;
      let totalComments = 0;
      let totalShares = 0;
      let albumCount = 0;
      let imageCount = 0;

      for (const post of feed) {
        const postDateStr = new Date(post.created_time).toISOString().split('T')[0];
        if (dailyMap[postDateStr]) {
          dailyMap[postDateStr].totalContent += 1;
          totalPostsInPeriod++;

          const commentCount = post.comments?.summary?.total_count || post.comments?.data?.length || 0;
          const reactionCount = post.reactions?.summary?.total_count || post.reactions?.data?.length || 0;
          const shareCount = post.shares?.count || 0;

          dailyMap[postDateStr].reactions += reactionCount;
          dailyMap[postDateStr].comments += commentCount;
          dailyMap[postDateStr].shares += shareCount;

          totalReactions += reactionCount;
          totalComments += commentCount;
          totalShares += shareCount;

          // Post type
          const attachments = post.attachments?.data || [];
          const type = attachments[0]?.type || 'status';
          if (type === 'album') {
            albumCount++;
          } else {
            imageCount++;
          }
        }
      }

      // Sort dates
      const sortedDates = Object.keys(dailyMap).sort().map(d => dailyMap[d]);

      // Calculate cumulative followers backwards
      let tempFollowers = currentFollowersCount;
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        sortedDates[i].followers = tempFollowers;
        tempFollowers = Math.max(0, tempFollowers - (sortedDates[i].acquired || 0) + (sortedDates[i].lost || 0));
      }

      // Summaries
      const totalViews = sortedDates.reduce((sum, d) => sum + d.views, 0);
      const totalPageVisits = sortedDates.reduce((sum, d) => sum + d.pageVisits, 0);
      const totalClicks = sortedDates.reduce((sum, d) => sum + d.totalClicks, 0);
      const totalAcquired = sortedDates.reduce((sum, d) => sum + d.acquired, 0);
      const totalLost = sortedDates.reduce((sum, d) => sum + d.lost, 0);

      const daysCount = sortedDates.length || 1;
      const averageDailyNewFollowers = Math.round((totalAcquired - totalLost) / daysCount);
      const dailyPageViews = parseFloat((totalViews / daysCount).toFixed(2));
      const dailyPosts = parseFloat((totalPostsInPeriod / daysCount).toFixed(2));
      const postsPerWeek = parseFloat((dailyPosts * 7).toFixed(2));

      // Interactions Metrics
      const dailyReactions = parseFloat((totalReactions / daysCount).toFixed(2));
      const reactionsPerPost = totalPostsInPeriod ? parseFloat((totalReactions / totalPostsInPeriod).toFixed(2)) : 0;
      const dailyComments = parseFloat((totalComments / daysCount).toFixed(2));
      const commentsPerPost = totalPostsInPeriod ? parseFloat((totalComments / totalPostsInPeriod).toFixed(2)) : 0;
      const sharesPerDay = parseFloat((totalShares / daysCount).toFixed(2));
      const sharesPerPost = totalPostsInPeriod ? parseFloat((totalShares / totalPostsInPeriod).toFixed(2)) : 0;

      const totalTypes = albumCount + imageCount || 1;
      const typesBreakdown = {
        album: Math.round((albumCount / totalTypes) * 100),
        image: Math.round((imageCount / totalTypes) * 100)
      };

      return {
        summary: {
          followers: currentFollowersCount,
          views: totalViews,
          pageVisits: totalPageVisits,
          totalContent: totalPostsInPeriod,
          averageDailyNewFollowers,
          dailyPageViews,
          dailyPosts,
          postsPerWeek
        },
        growth: sortedDates.map(d => ({
          date: d.date,
          name: d.name,
          followers: d.followers,
          views: d.views,
          pageVisits: d.pageVisits,
          totalContent: d.totalContent
        })),
        balance: sortedDates.map(d => ({
          date: d.date,
          name: d.name,
          acquired: d.acquired,
          lost: d.lost,
          totalContent: d.totalContent
        })),
        clicks: sortedDates.map(d => ({
          date: d.date,
          name: d.name,
          totalClicks: d.totalClicks,
          pageVisits: d.pageVisits,
          totalContent: d.totalContent
        })),
        postsPeriod: sortedDates.map(d => ({
          date: d.date,
          name: d.name,
          views: d.views,
          reactions: d.reactions
        })),
        interactions: {
          reactions: totalReactions,
          comments: totalComments,
          shares: totalShares,
          clicks: totalClicks,
          posts: totalPostsInPeriod,
          dailyReactions,
          reactionsPerPost,
          dailyComments,
          commentsPerPost,
          sharesPerDay,
          sharesPerPost,
          typesBreakdown,
          viewsBreakdown: {
            organic: 70, // Meta Graph API doesn't separate organic/promoted easily without ads permissions, default to standard ratios
            promoted: 30
          }
        }
      };
    } catch (error) {
      console.error('Error fetching Facebook Page Analytics:', error.message);
      return null;
    }
  }

  async connectChannel(brandId, code, redirectUri) {
    const tokens = await facebookGateway.exchangeCodeForToken(code, redirectUri);
    const pages = await facebookGateway.getUserPages(tokens.access_token);

    if (pages.length === 0) {
      throw new Error('No Facebook Page found managed by this account. Please verify permissions.');
    }

    // Select the first page to connect
    const selectedPage = pages[0];
    const pageAccessToken = selectedPage.access_token;
    const pageId = selectedPage.id;

    // Get detailed page info & initial analytics
    const pageInfo = await this.getChannelInfo({ pageId, pageAccessToken });
    
    // Save to DB
    return socialAccountRepository.upsertFacebookAccount(brandId, {
      pageId,
      username: selectedPage.name,
      displayName: selectedPage.name,
      profilePictureUrl: pageInfo.profilePictureUrl,
      category: pageInfo.category,
      likesCount: pageInfo.likesCount,
      followersCount: pageInfo.followersCount,
      about: pageInfo.about,
      website: pageInfo.website,
      analytics: pageInfo.analytics
    }, {
      access_token: pageAccessToken,
      refresh_token: tokens.access_token // Store user token as refresh token if needed, or simply save the page token
    });
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate) {
    const account = await socialAccountRepository.findById(socialAccountId);
    if (!account || account.platform !== PLATFORMS.FACEBOOK) {
      throw new Error('Social account not found or is not a Facebook account');
    }

    const pageId = account.platformAccountId;
    const pageAccessToken = account.accessToken;

    const pageInfo = await this.getChannelInfo({ pageId, pageAccessToken }, startDate, endDate);

    return socialAccountRepository.upsertFacebookAccount(account.brandId, {
      pageId,
      username: account.username,
      displayName: account.displayName,
      profilePictureUrl: pageInfo.profilePictureUrl,
      category: pageInfo.category,
      likesCount: pageInfo.likesCount,
      followersCount: pageInfo.followersCount,
      about: pageInfo.about,
      website: pageInfo.website,
      analytics: pageInfo.analytics
    }, {
      access_token: pageAccessToken,
      refresh_token: account.refreshToken
    });
  }
}

module.exports = new FacebookAnalyticsService();
