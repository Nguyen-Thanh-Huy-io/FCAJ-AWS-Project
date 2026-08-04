const { API_VERSIONS, SEPARATORS, FACEBOOK_API } = require('../../../utils/constants');
const path = require('path');
const fs = require('fs');

class InstagramGateway {
  constructor() {
    this.graphBaseUrl = `${FACEBOOK_API.GRAPH_URL}/${API_VERSIONS.FACEBOOK}`;
  }

  /**
   * Lấy thông tin Instagram Business Account liên kết với Facebook Page
   */
  async getInstagramAccountForPage(pageId, pageAccessToken) {
    const fields = 'instagram_business_account{id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website}';
    const url = `${this.graphBaseUrl}/${pageId}?fields=${fields}&access_token=${pageAccessToken}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to fetch Instagram business account linked to Facebook Page: ${pageId}`);
    }

    const data = await res.json();
    const igAccount = data.instagram_business_account;
    if (!igAccount) return null;

    return {
      igAccountId: igAccount.id,
      username: igAccount.username,
      displayName: igAccount.name || igAccount.username,
      profilePictureUrl: igAccount.profile_picture_url || '',
      followersCount: igAccount.followers_count || 0,
      followingCount: igAccount.follows_count || 0,
      mediaCount: igAccount.media_count || 0,
      biography: igAccount.biography || null,
      website: igAccount.website || null
    };
  }

  /**
   * Tạo media container cho hình ảnh đơn lẻ
   */
  async createImageContainer(igAccountId, accessToken, imageUrl, caption, scheduledAt = null) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      image_url: this._ensurePublicUrl(imageUrl),
      caption: caption || '',
      access_token: accessToken
    };
    if (scheduledAt) {
      body.scheduled_publish_time = Math.floor(new Date(scheduledAt).getTime() / 1000);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[InstagramGateway] createImageContainer FAILED:', JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || 'Failed to create Instagram image container');
    }

    return res.json();
  }

  /**
   * Tạo media container cho video đơn lẻ
   */
  async createVideoContainer(igAccountId, accessToken, videoUrl, caption, scheduledAt = null) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      media_type: 'REELS',
      video_url: this._ensurePublicUrl(videoUrl),
      caption: caption || '',
      access_token: accessToken
    };
    if (scheduledAt) {
      body.scheduled_publish_time = Math.floor(new Date(scheduledAt).getTime() / 1000);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[InstagramGateway] createVideoContainer FAILED:', JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || 'Failed to create Instagram video container');
    }

    return res.json();
  }

  /**
   * Tạo media container cho Reels
   */
  async createReelContainer(igAccountId, accessToken, videoUrl, caption, scheduledAt = null) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      media_type: 'REELS',
      video_url: this._ensurePublicUrl(videoUrl),
      caption: caption || '',
      access_token: accessToken
    };
    if (scheduledAt) {
      body.scheduled_publish_time = Math.floor(new Date(scheduledAt).getTime() / 1000);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[InstagramGateway] createReelContainer FAILED:', JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || 'Failed to create Instagram Reel container');
    }

    return res.json();
  }

  /**
   * Tạo media container cho Stories
   */
  async createStoryContainer(igAccountId, accessToken, mediaUrl, isVideo = false) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      media_type: 'STORIES',
      access_token: accessToken
    };

    if (isVideo) {
      body.video_url = this._ensurePublicUrl(mediaUrl);
    } else {
      body.image_url = this._ensurePublicUrl(mediaUrl);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[InstagramGateway] createStoryContainer FAILED:', JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || 'Failed to create Instagram Story container');
    }

    return res.json();
  }

  /**
   * Tạo container con cho Album/Carousel
   */
  async createCarouselItemContainer(igAccountId, accessToken, mediaUrl, isVideo = false) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      is_carousel_item: true,
      access_token: accessToken
    };

    if (isVideo) {
      body.media_type = 'VIDEO';
      body.video_url = this._ensurePublicUrl(mediaUrl);
    } else {
      body.image_url = this._ensurePublicUrl(mediaUrl);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('[InstagramGateway] createCarouselItemContainer FAILED:', JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || 'Failed to create Instagram Carousel Item container');
    }

    return res.json();
  }

  /**
   * Tạo container cha cho Album/Carousel
   */
  async createCarouselContainer(igAccountId, accessToken, childrenIds, caption, scheduledAt = null) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media`;
    const body = {
      media_type: 'CAROUSEL',
      children: childrenIds.join(SEPARATORS.COMMA),
      caption: caption || '',
      access_token: accessToken
    };
    if (scheduledAt) {
      body.scheduled_publish_time = Math.floor(new Date(scheduledAt).getTime() / 1000);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to create Instagram Carousel container');
    }

    return res.json();
  }

  /**
   * Kiểm tra trạng thái container (Polling)
   */
  async pollContainerStatus(containerId, accessToken) {
    const url = `${this.graphBaseUrl}/${containerId}?fields=status_code,status&access_token=${accessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to fetch container status for ${containerId}`);
    }

    return res.json();
  }

  /**
   * Publish container đã xử lý xong
   */
  async publishContainer(igAccountId, accessToken, containerId) {
    const url = `${this.graphBaseUrl}/${igAccountId}/media_publish`;
    const body = {
      creation_id: containerId,
      access_token: accessToken
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to publish Instagram media container');
    }

    return res.json();
  }

  /**
   * Lấy danh sách feed bài đăng
   */
  async getInstagramMediaFeed(igAccountId, accessToken, pageToken = null, limit = 10) {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
    let url = `${this.graphBaseUrl}/${igAccountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
    if (pageToken) {
      url += `&after=${pageToken}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to fetch Instagram media feed');
    }

    const data = await res.json();
    return {
      data: data.data || [],
      nextPageToken: data.paging?.cursors?.after || null,
      prevPageToken: data.paging?.cursors?.before || null
    };
  }

  /**
   * Lấy insights của một bài đăng Instagram
   */
  async getInstagramMediaInsights(mediaId, accessToken, metrics = 'impressions,reach,saved') {
    const url = `${this.graphBaseUrl}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      // Có thể không có insights nếu bài đăng quá mới hoặc bị lỗi phân quyền, trả về mảng rỗng để fallback
      return [];
    }

    const data = await res.json();
    return data.data || [];
  }

  /**
   * Lấy bình luận của một bài đăng Instagram
   */
  async getMediaComments(mediaId, accessToken) {
    const fields = 'id,text,timestamp,from,replies{id,text,timestamp,from}';
    const url = `${this.graphBaseUrl}/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`;
    
    const res = await fetch(url);
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.data || [];
  }

  /**
   * Trả lời bình luận trên Instagram
   */
  async replyToComment(commentId, text, accessToken) {
    const url = `${this.graphBaseUrl}/${commentId}/replies?message=${encodeURIComponent(text)}&access_token=${accessToken}`;
    
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'Failed to reply to comment on Instagram');
    }
    
    return res.json();
  }

  // ============= Private Helper Methods =============

  /**
   * Đảm bảo URL luôn là CloudFront URL nếu có cấu hình CLOUDFRONT_DOMAIN.
   * Giúp khắc phục lỗi 403 khi truy cập S3 trực tiếp trên các bài post cũ.
   */
  _ensurePublicUrl(url) {
    if (!url) return url;
    
    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
    if (cloudfrontDomain && url.includes('s3.ap-southeast-2.amazonaws.com')) {
      try {
        const urlObj = new URL(url);
        return `https://${cloudfrontDomain}${urlObj.pathname}`;
      } catch (err) {
        return url;
      }
    }
    return url;
  }
}

module.exports = new InstagramGateway();
