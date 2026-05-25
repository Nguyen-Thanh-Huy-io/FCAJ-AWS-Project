const { PLATFORMS } = require('../../../utils/constants');

class FacebookGateway {
  constructor() {
    this.appId = process.env.FACEBOOK_APP_ID;
    this.appSecret = process.env.FACEBOOK_APP_SECRET;
    this.graphBaseUrl = 'https://graph.facebook.com/v25.0';
  }

  async exchangeCodeForToken(code, redirectUri) {
    const url = `${this.graphBaseUrl}/oauth/access_token?client_id=${this.appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${this.appSecret}&code=${code}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to exchange Facebook code for access token');
    }
    
    return res.json();
  }

  async getUserPages(userAccessToken) {
    const url = `${this.graphBaseUrl}/me/accounts?access_token=${userAccessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to fetch user Facebook pages');
    }
    
    const data = await res.json();
    return data.data || [];
  }

  async getPageDetails(pageId, pageAccessToken) {
    const url = `${this.graphBaseUrl}/${pageId}?fields=id,name,picture{url},category,about,website,fan_count,followers_count&access_token=${pageAccessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to fetch Facebook page details for ${pageId}`);
    }
    
    const data = await res.json();
    return {
      pageId: data.id,
      username: data.name,
      displayName: data.name,
      profilePictureUrl: data.picture?.data?.url || '',
      category: data.category || null,
      likesCount: data.fan_count || 0,
      followersCount: data.followers_count || 0,
      about: data.about || null,
      website: data.website || null
    };
  }

  async getPageInsights(pageId, pageAccessToken, startDate, endDate) {
    // Facebook API format for since/until expects UNIX timestamps
    const since = Math.floor(new Date(startDate).getTime() / 1000);
    const until = Math.floor(new Date(endDate).getTime() / 1000);

    const fullMetrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_daily_follows_unique',
      'page_post_engagements'
    ];

    const tryFetch = async (metricList) => {
      const url = `${this.graphBaseUrl}/${pageId}/insights?metric=${metricList.join(',')}&period=day&since=${since}&until=${until}&access_token=${pageAccessToken}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { error: errData.error, url };
      }
      return { data: await res.json() };
    };

    // First attempt with full metrics (including NPE ones)
    let result = await tryFetch(fullMetrics);

    // If failed with code 100 (Invalid metric), it's likely a Classic Page that doesn't support NPE metrics
    if (result.error && result.error.code === 100) {
      console.log(`Facebook Insights API error for NPE metrics: ${JSON.stringify(result.error)}. URL: ${result.url}`);
      console.log('Retrying Facebook Insights with legacy metrics subset...');
      const legacyMetrics = [
        'page_views_total',
        'page_impressions_unique',
        'page_post_engagements'
      ];
      result = await tryFetch(legacyMetrics);
    }

    if (result.error) {
      console.error(`Facebook Insights API final error: ${JSON.stringify(result.error)}. URL: ${result.url}`);
      return [];
    }

    return result.data.data || [];
  }

  async getPageFeed(pageId, pageAccessToken, limit = 10) {
    const fields = 'id,message,story,created_time,full_picture,attachments{media,type},shares,comments.summary(true),reactions.summary(true)';
    const url = `${this.graphBaseUrl}/${pageId}/feed?fields=${fields}&limit=${limit}&access_token=${pageAccessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to fetch Facebook page feed');
    }

    const data = await res.json();
    return data.data || [];
  }

  async getPostInsights(postId, pageAccessToken) {
    const metrics = 'post_impressions_unique,post_impressions,post_clicks_by_type';
    const url = `${this.graphBaseUrl}/${postId}/insights?metric=${metrics}&access_token=${pageAccessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      // In Facebook, some posts (like shared items or old posts) might fail to return insights
      return [];
    }

    const data = await res.json();
    return data.data || [];
  }
}

module.exports = new FacebookGateway();
