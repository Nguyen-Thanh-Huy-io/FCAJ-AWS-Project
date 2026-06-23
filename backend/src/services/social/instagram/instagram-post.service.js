const instagramGateway = require('./instagram.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, POST_STATUS, POST_TYPES, DEFAULT_CONFIG } = require('../../../utils/constants');
const InstagramPublishStrategyFactory = require('./publish-strategies/publish-strategy.factory');

const postCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class InstagramPostService {
  async getPublishedPosts(brandId, pageToken = null, limit = 10) {
    const cacheKey = `${brandId}_${pageToken || 'first'}_${limit}`;
    const cached = postCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) return cached.data;

    try {
      const { igAccountId, accessToken } = await this._getAccountCredentials(brandId);
      
      if (accessToken && accessToken.startsWith('mock-')) {
        return { data: [], nextPageToken: null, prevPageToken: null };
      }

      const { data: feed, nextPageToken, prevPageToken } = await instagramGateway.getInstagramMediaFeed(igAccountId, accessToken, pageToken, limit);

      const postsWithInsights = await Promise.all(
        feed.map(post => this._enrichPostWithInsights(post, accessToken))
      );

      const result = {
        data: postsWithInsights,
        nextPageToken,
        prevPageToken
      };

      postCache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
      return result;
    } catch (error) {
      if (error.message.includes('Instagram account not connected')) {
        return { data: [], nextPageToken: null, prevPageToken: null };
      }
      throw error;
    }
  }

  async publishPost(brandId, postData) {
    const { igAccountId, accessToken } = await this._getAccountCredentials(brandId);
    const { type, mediaUrls = [] } = postData;

    const strategy = InstagramPublishStrategyFactory.getStrategy(type, mediaUrls);
    const result = await strategy.publish(igAccountId, accessToken, postData);

    return { platformVideoId: result.id, publishedAt: new Date() };
  }

  // ============= Private Helper Methods =============

  async _getAccountCredentials(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.INSTAGRAM);
    if (!socialAccount || socialAccount.length === 0) {
      throw new Error('Instagram account not connected for this brand');
    }
    return {
      igAccountId: socialAccount[0].platformAccountId,
      accessToken: socialAccount[0].accessToken
    };
  }

  async _enrichPostWithInsights(post, accessToken) {
    try {
      const insights = await instagramGateway.getInstagramMediaInsights(post.id, accessToken);
      const metrics = this._parseInsightsMetrics(insights);

      const reactions = post.like_count || 0;
      const comments = post.comments_count || 0;
      const shares = metrics.shares || 0;
      
      const totalInteractions = reactions + comments + shares;
      const reach = metrics.reach || 0;
      const views = metrics.impressions || 0;
      const clicks = metrics.clicks || 0;

      const engagement = reach ? parseFloat((((reactions + comments + shares + clicks) / reach) * 100).toFixed(2)) : 0;

      return {
        id: post.id,
        message: post.caption || DEFAULT_CONFIG.NO_CONTENT || 'No caption',
        type: this._determinePostType(post),
        mediaUrl: post.media_url || post.thumbnail_url || '',
        date: post.timestamp,
        status: POST_STATUS.PUBLISHED,
        reach,
        views,
        reactions,
        comments,
        shares,
        clicks,
        linkClicks: Math.round(clicks * 0.2),
        videoViews: post.media_type === 'VIDEO' ? views : 0,
        videoTimeWatched: post.media_type === 'VIDEO' ? '0:20' : '0:00',
        engagement,
        spent: 0
      };
    } catch (err) {
      console.error(`Error enriching post insights for post ${post.id}:`, err.message);
      return this._formatFallbackPost(post);
    }
  }

  _parseInsightsMetrics(insights) {
    const result = { reach: 0, impressions: 0, shares: 0, clicks: 0 };
    for (const item of insights) {
      if (item.name === 'reach') result.reach = item.values?.[0]?.value || 0;
      else if (item.name === 'impressions') result.impressions = item.values?.[0]?.value || 0;
      else if (item.name === 'shares') result.shares = item.values?.[0]?.value || 0;
    }
    return result;
  }

  _determinePostType(post) {
    if (post.media_type === 'CAROUSEL_ALBUM') return POST_TYPES.CAROUSEL;
    if (post.media_type === 'VIDEO') return POST_TYPES.VIDEO;
    return POST_TYPES.IMAGE;
  }

  _formatFallbackPost(post) {
    const reactions = post.like_count || 0;
    const comments = post.comments_count || 0;

    return {
      id: post.id,
      message: post.caption || 'Instagram Post',
      type: this._determinePostType(post),
      mediaUrl: post.media_url || post.thumbnail_url || '',
      date: post.timestamp,
      status: POST_STATUS.PUBLISHED,
      reach: 0,
      views: 0,
      reactions,
      comments,
      shares: 0,
      clicks: 0,
      linkClicks: 0,
      videoViews: 0,
      videoTimeWatched: '0:00',
      engagement: 0,
      spent: 0
    };
  }
}

module.exports = new InstagramPostService();
