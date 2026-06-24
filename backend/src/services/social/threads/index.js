const BaseSocialService = require('../base-social.service');
const threadsGateway = require('./threads.gateway');
const { PLATFORMS } = require('../../../utils/constants');

class ThreadsService extends BaseSocialService {
  async getChannelInfo(auth, startDate, endDate) {
    try {
      const pageId = auth.igAccountId || auth.pageId;
      const pageAccessToken = auth.pageAccessToken || auth.accessToken;
      
      const profile = await threadsGateway.getAccountDetails(pageAccessToken);
      
      return {
        igAccountId: profile.id,
        username: profile.username,
        displayName: profile.name || profile.username,
        profilePictureUrl: profile.threads_profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        followersCount: 0, // Sẽ điền thêm từ insights nếu có
        followingCount: 0,
        mediaCount: 0,
        biography: profile.threads_biography || '',
        website: '',
        analytics: []
      };
    } catch (error) {
      console.error('Threads getChannelInfo error:', error);
      // Fallback khi chạy thử nghiệm
      return {
        igAccountId: auth.platformAccountId || 'threads_fallback_id',
        username: auth.username || 'threads_user_fallback',
        displayName: auth.displayName || 'Threads Account',
        profilePictureUrl: auth.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        followersCount: 1500,
        followingCount: 300,
        mediaCount: 10,
        biography: '',
        website: '',
        analytics: []
      };
    }
  }

  async getAnalyticsReport(auth, startDate, endDate) {
    // Với tài khoản thật, ta có thể lấy qua Threads Insights API
    const pageId = auth.igAccountId || auth.pageId;
    const pageAccessToken = auth.pageAccessToken || auth.accessToken;
    
    let insights = null;
    try {
      insights = await threadsGateway.getInsights(pageId, pageAccessToken);
    } catch (e) {
      console.warn('Threads Insights API failed, falling back to mock graph data:', e.message);
    }

    const days = 30;
    const analytics = [];
    const balance = [];
    const today = new Date();
    
    // Tự sinh chuỗi ngày
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const views = Math.floor(1000 + Math.sin(i) * 500 + Math.random() * 200);
      const likes = Math.floor(views * 0.08 + Math.random() * 15);
      const replies = Math.floor(likes * 0.15 + Math.random() * 5);
      const reposts = Math.floor(likes * 0.05 + Math.random() * 2);
      
      const acquired = Math.floor(30 + Math.sin(i) * 10 + Math.random() * 5);
      const lost = Math.floor(5 + Math.cos(i) * 3 + Math.random() * 2);

      analytics.push({
        date: dateString,
        views,
        likes,
        replies,
        reposts,
        followersCount: 12000 + (30 - i) * 15,
        totalContent: i % 5 === 0 ? 1 : 0
      });

      balance.push({
        date: dateString,
        acquired,
        lost
      });
    }

    const summary = {
      views: insights?.data?.find(m => m.name === 'views')?.values?.[0]?.value || analytics.reduce((acc, curr) => acc + curr.views, 0),
      likes: insights?.data?.find(m => m.name === 'likes')?.values?.[0]?.value || analytics.reduce((acc, curr) => acc + curr.likes, 0),
      replies: insights?.data?.find(m => m.name === 'replies')?.values?.[0]?.value || analytics.reduce((acc, curr) => acc + curr.replies, 0),
      reposts: insights?.data?.find(m => m.name === 'reposts')?.values?.[0]?.value || analytics.reduce((acc, curr) => acc + curr.reposts, 0),
      followersCount: insights?.data?.find(m => m.name === 'followers_count')?.values?.[0]?.value || 12500,
      totalContent: analytics.reduce((acc, curr) => acc + curr.totalContent, 0)
    };

    const typesBreakdown = {
      TEXT: Math.floor(summary.totalContent * 0.4) || 2,
      IMAGE: Math.floor(summary.totalContent * 0.4) || 2,
      VIDEO: Math.floor(summary.totalContent * 0.2) || 1
    };

    return {
      audienceDemographicsJson: JSON.stringify({
        growth: analytics.map(a => ({
          date: a.date,
          views: a.views,
          reactions: a.likes,
          comments: a.replies,
          shares: a.reposts,
          totalContent: a.totalContent
        })),
        balance: balance,
        clicks: analytics.map(a => ({ date: a.date, totalClicks: Math.floor(a.likes * 0.1) })),
        summary: summary,
        interactions: {
          comments: summary.replies,
          shares: summary.reposts,
          typesBreakdown: typesBreakdown,
          viewsBreakdown: {
            organic: Math.floor(summary.views * 0.9),
            promoted: Math.floor(summary.views * 0.1)
          }
        }
      })
    };
  }

  async connectChannel(brandId, code, redirectUri) {
    const { ConnectionConflictGuard, ConnectionConflictError } = require('../connection-conflict.guard');
    
    // 1. Đổi code lấy short-lived access token
    const shortTokenRes = await threadsGateway.exchangeCodeForToken(code, redirectUri);
    const shortToken = shortTokenRes.access_token;
    const userId = shortTokenRes.user_id;

    // 2. Đổi lấy long-lived access token (60 ngày)
    const longTokenRes = await threadsGateway.getLongLivedToken(shortToken);
    const longToken = longTokenRes.access_token;

    // 3. Lấy thông tin chi tiết profile thật
    const profile = await threadsGateway.getAccountDetails(longToken);

    // 4. Lấy mock analytics report ban đầu
    const report = await this.getAnalyticsReport({
      igAccountId: profile.id,
      pageAccessToken: longToken
    });

    // 5. Lưu vào Database
    return require('../../../repositories/social/social-account.repository').upsertInstagramAccount(brandId, {
      igAccountId: profile.id,
      username: profile.username,
      displayName: profile.name || profile.username,
      profilePictureUrl: profile.threads_profile_picture_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      followersCount: 12500,
      followingCount: 300,
      mediaCount: 10,
      biography: profile.threads_biography || '',
      website: '',
      analytics: report
    }, {
      access_token: longToken,
      refresh_token: '' // Threads long-lived token tự gia hạn không cần refresh_token
    }, PLATFORMS.THREADS);
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate, force = false) {
    const account = await require('../../../repositories/social/social-account.repository').findById(socialAccountId);
    if (!account || account.platform !== PLATFORMS.THREADS) {
      throw new Error('Social account not found or is not a Threads account');
    }
    
    const profile = await this.getChannelInfo({
      igAccountId: account.platformAccountId,
      pageAccessToken: account.accessToken
    });

    const report = await this.getAnalyticsReport({
      igAccountId: account.platformAccountId,
      pageAccessToken: account.accessToken
    }, startDate, endDate);

    return require('../../../repositories/social/social-account.repository').upsertInstagramAccount(account.brandId, {
      igAccountId: account.platformAccountId,
      username: profile.username,
      displayName: profile.displayName,
      profilePictureUrl: profile.profilePictureUrl,
      followersCount: profile.followersCount || 12500,
      followingCount: profile.followingCount || 300,
      mediaCount: profile.mediaCount || 10,
      biography: profile.biography,
      website: profile.website,
      analytics: report
    }, {
      access_token: account.accessToken,
      refresh_token: account.refreshToken
    }, PLATFORMS.THREADS);
  }

  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    try {
      const account = await require('../../../repositories/social/social-account.repository').findByBrandAndPlatform(brandId, PLATFORMS.THREADS);
      if (!account || account.length === 0) {
        return { data: [], nextPageToken: null, prevPageToken: null };
      }

      const activeAccount = account[0];
      const pageId = activeAccount.platformAccountId;
      const accessToken = activeAccount.accessToken;

      if (accessToken && accessToken.startsWith('mock-')) {
        return { data: [], nextPageToken: null, prevPageToken: null };
      }

      const feedResult = await threadsGateway.getThreadsMediaFeed(pageId, accessToken, pageToken, limit);
      const feed = feedResult.data || [];
      const nextPageToken = feedResult.nextPageToken || null;
      const prevPageToken = feedResult.prevPageToken || null;

      const posts = feed.map(post => {
        const reactions = post.like_count || 0;
        const comments = 0; // Threads API v1.0 chưa trả về comments_count trực tiếp dễ dàng
        const shares = 0;
        const clicks = 0;
        const reach = Math.floor(reactions * 8 + Math.random() * 20);
        const views = Math.floor(reach * 1.5);
        const engagement = reach ? parseFloat((((reactions) / reach) * 100).toFixed(2)) : 0;

        return {
          id: post.id,
          message: post.text || 'Threads Post',
          type: post.media_type || 'TEXT',
          mediaUrl: post.media_url || '',
          date: post.timestamp,
          status: 'PUBLISHED',
          reach,
          views,
          reactions,
          comments,
          shares,
          clicks,
          engagement
        };
      });

      return {
        data: posts,
        nextPageToken,
        prevPageToken
      };
    } catch (error) {
      console.error('Threads getPublishedVideos error:', error);
      return {
        data: [],
        nextPageToken: null,
        prevPageToken: null
      };
    }
  }

  async publishPost(brandId, postData) {
    const accounts = await require('../../../repositories/social/social-account.repository').findByBrandAndPlatform(brandId, PLATFORMS.THREADS);
    if (!accounts || accounts.length === 0) throw new Error('Threads account not linked');
    const account = accounts[0];

    const text = postData.caption || '';
    const mediaUrl = (postData.mediaUrls && postData.mediaUrls.length > 0) ? postData.mediaUrls[0] : null;
    const mediaType = mediaUrl ? 'IMAGE' : 'TEXT';
    const whoCanReply = postData.options?.threadsWhoCanReply || null;

    // Tạo media container
    const container = await threadsGateway.createMediaContainer(account.platformAccountId, account.accessToken, text, mediaUrl, mediaType, whoCanReply);
    
    // Publish container
    const publishRes = await threadsGateway.publishMediaContainer(account.platformAccountId, account.accessToken, container.id);
    
    return {
      success: true,
      platformVideoId: publishRes.id,
      publishedAt: new Date()
    };
  }

  async deletePost(brandId, platformPostId) {
    console.log(`[Threads Service] deletePost triggered for brandId: ${brandId}, platformPostId: ${platformPostId}`);
    const accounts = await require('../../../repositories/social/social-account.repository').findByBrandAndPlatform(brandId, PLATFORMS.THREADS);
    if (!accounts || accounts.length === 0) {
      console.warn(`[Threads Service] No connected Threads accounts found for brandId: ${brandId}`);
      throw new Error('Threads account not linked');
    }
    const account = accounts[0];
    console.log(`[Threads Service] Using connected Threads account: @${account.username} (${account.platformAccountId})`);
    console.log(`[Threads Service] Calling threadsGateway.deletePost with media ID: ${platformPostId}`);
    const res = await threadsGateway.deletePost(platformPostId, account.accessToken);
    console.log(`[Threads Service] threadsGateway.deletePost successful response:`, res);
    return res;
  }
}

module.exports = new ThreadsService();
