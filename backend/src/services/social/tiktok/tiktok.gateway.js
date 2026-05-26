const { API_VERSIONS } = require('../../../utils/constants');

class TikTokGateway {
  constructor() {
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.apiBaseUrl = 'https://open.tiktokapis.com';
    this.authBaseUrl = 'https://www.tiktok.com/v2/auth/authorize';
    this.version = API_VERSIONS.TIKTOK;
  }

  /**
   * Get Auth URL for TikTok OAuth 2.0
   */
  getAuthUrl(scopes, state, redirectUri) {
    const scopeString = encodeURIComponent(scopes.join(','));
    const encodedRedirect = encodeURIComponent(redirectUri);
    
    // Authorization MUST go to www.tiktok.com, not open.tiktokapis.com
    return `${this.authBaseUrl}?client_key=${this.clientKey}&scope=${scopeString}&response_type=code&redirect_uri=${encodedRedirect}&state=${state}`;
  }

  /**
   * Exchange Code for Access Token
   */
  async exchangeCodeForToken(code, redirectUri) {
    const url = `${this.apiBaseUrl}/v2/oauth/token/`;
    const params = new URLSearchParams();
    params.append('client_key', this.clientKey);
    params.append('client_secret', this.clientSecret);
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);

    console.log(`[TikTok OAuth] Exchanging code for token...`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[TikTok OAuth] Token Exchange Failed:', JSON.stringify(data));
      throw new Error(data.error_description || data.message || 'Failed to exchange TikTok code');
    }

    return data;
  }

  async getUserInfo(accessToken) {
    // Request basic info AND statistics
    const fields = [
      'open_id', 
      'union_id', 
      'avatar_url', 
      'display_name',
      'follower_count',
      'following_count',
      'likes_count',
      'video_count'
    ].join(',');
    
    const url = `${this.apiBaseUrl}/v2/user/info/?fields=${fields}`;
    
    console.log(`[TikTok OAuth] Fetching user info with stats...`);
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error(`[TikTok OAuth] User Info Failed (Status ${res.status}):`, JSON.stringify(data));
      throw new Error(data.error?.message || data.message || 'Failed to fetch TikTok user info');
    }

    return data.data?.user;
  }

  /**
   * Post Video to TikTok
   * Uses the Content Posting API (Direct Post)
   */
  async publishVideo(accessToken, videoUrl, title) {
    const url = `${this.apiBaseUrl}/v2/post/publish/video/init/`;
    
    // Step 1: Initialize upload
    const initRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title: title,
          privacy_level: 'PUBLIC_TO_EVERYONE', // Default
          disable_duet: false,
          disable_stitch: false,
          disable_comment: false
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: videoUrl
        }
      })
    });

    if (!initRes.ok) {
      const err = await initRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to initialize TikTok video post');
    }

    const data = await initRes.json();
    return data.data; // contains publish_id
  }

  /**
   * Get Published Videos
   */
  async getVideoList(accessToken, cursor = 0, maxCount = 20) {
    const fields = [
      'id', 'create_time', 'cover_image_url', 'share_url', 
      'video_description', 'duration', 'title', 
      'like_count', 'comment_count', 'share_count', 'view_count'
    ].join(',');
    
    const url = `${this.apiBaseUrl}/v2/video/list/?fields=${fields}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        max_count: maxCount,
        cursor: cursor
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[TikTok Gateway] Get Video List Failed:', JSON.stringify(data));
      throw new Error(data.error?.message || data.message || 'Failed to fetch TikTok videos');
    }

    return data.data; // returns { videos: [...], cursor: number, has_more: boolean }
  }
}

module.exports = new TikTokGateway();
