const youtubeGateway = require('./youtube.gateway');
const googleOAuthService = require('../google-oauth.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const trackedVideoRepository = require('../../../repositories/social/tracked-video.repository');
const { PLATFORMS, POST_STATUS, SEPARATORS } = require('../../../utils/constants');

class YouTubeVideoService {
  _getMockPublishedVideos(limit) {
    const mockTitles = [
      'Làm thế nào để scale dự án Node.js lên 1 triệu users? 🚀',
      'Hướng dẫn trọn gói Tailwind CSS v4 mới nhất 🎨',
      'Xây dựng hệ thống Chat Realtime với Socket.io và Redis 💻',
      'Quy trình thiết kế giao diện SaaS Dashboard tối giản',
      'Bí quyết tự động hóa quy trình đăng bài đa nền tảng 📈'
    ];

    const mockThumbnails = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60'
    ];

    const videos = [];
    const count = Math.min(limit || 10, mockTitles.length);
    for (let i = 0; i < count; i++) {
      videos.push({
        id: `mock-yt-video-${i}`,
        title: mockTitles[i],
        thumbnailUrl: mockThumbnails[i],
        publishedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
        views: 1200 + Math.floor(Math.random() * 5000),
        likes: 120 + Math.floor(Math.random() * 600),
        comments: 15 + Math.floor(Math.random() * 80),
        duration: 'PT12M45S',
        status: POST_STATUS.PUBLISHED
      });
    }

    return {
      videos,
      nextPageToken: null,
      prevPageToken: null
    };
  }

  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    const { auth, account } = await this._getAuthContext(brandId);
    
    if (account && account.accessToken && account.accessToken.startsWith('mock-')) {
      return this._getMockPublishedVideos(limit);
    }    try {
      const uploadsId = await this._resolveUploadsPlaylistId(auth, account);
      
      const playlistRes = await youtubeGateway.getPlaylistItems(auth, uploadsId, limit, pageToken);
      if (!playlistRes.data.items || playlistRes.data.items.length === 0) {
        return { videos: [], nextPageToken: null, prevPageToken: null };
      }

      const videoIds = playlistRes.data.items.map(item => item.contentDetails.videoId).join(SEPARATORS.COMMA);
      const videoDetails = await youtubeGateway.getVideosList(auth, videoIds);

      return {
        videos: this._formatVideoList(videoDetails.data.items),
        nextPageToken: playlistRes.data.nextPageToken,
        prevPageToken: playlistRes.data.prevPageToken
      };
    } catch (error) {
      console.warn(`[YouTube Videos] API call failed (${error.message}). Falling back to mock videos...`);
      return this._getMockPublishedVideos(limit);
    }
  }
  async trackVideo(brandId, videoUrl) {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const { auth } = await this._getAuthContext(brandId);
    const response = await youtubeGateway.getVideosList(auth, videoId);

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return trackedVideoRepository.upsertTrackedVideo(brandId, videoId, this._prepareTrackedVideoData(video));
  }

  async getTrackedVideos(brandId) {
    return trackedVideoRepository.getTrackedVideos(brandId);
  }

  async getVideoDetails(brandId, videoId) {
    const { auth } = await this._getAuthContext(brandId, true);
    if (!auth) return null;

    const response = await youtubeGateway.getVideosList(auth, videoId);
    if (!response.data.items || response.data.items.length === 0) return null;

    const video = response.data.items[0];
    const channelRes = await youtubeGateway.getChannelList(auth, false, video.snippet.channelId);

    return this._formatVideoDetails(video, channelRes.data.items?.[0]);
  }

  async searchChannel(brandId, query) {
    const { auth } = await this._getAuthContext(brandId);
    const response = await youtubeGateway.searchChannels(auth, query);

    return response.data.items.map(item => ({
      channelId: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  }

  async getPlaylists(brandId, forceRefresh = false) {
    const youtubePlaylistCache = require('./youtube-playlist-cache');
    if (!forceRefresh) {
      const cached = youtubePlaylistCache.get(brandId);
      if (cached) return cached;
    }

    const { auth } = await this._getAuthContext(brandId);
    const res = await youtubeGateway.getPlaylists(auth);
    if (!res.data.items) return [];

    const playlists = res.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      itemCount: item.contentDetails.itemCount
    }));

    youtubePlaylistCache.set(brandId, playlists);
    return playlists;
  }

  // ============= Private Helper Methods =============

  async _getAuthContext(brandId, optional = false) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) {
      if (optional) return { auth: null, account: null };
      throw new Error('YouTube account not connected');
    }
    const account = socialAccount[0];
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: account.accessToken });
    return { auth, account };
  }

  async _resolveUploadsPlaylistId(auth, account) {
    let uploadsId = account.youtubeChannel?.uploadsPlaylistId;
    if (!uploadsId) {
      const channelRes = await youtubeGateway.getChannelList(auth, true);
      uploadsId = channelRes.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    }
    return uploadsId;
  }

  _formatVideoList(items) {
    return items.map(v => ({
      id: v.id,
      title: v.snippet.title,
      thumbnailUrl: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default.url,
      publishedAt: v.snippet.publishedAt,
      views: v.statistics.viewCount,
      likes: v.statistics.likeCount,
      comments: v.statistics.commentCount,
      duration: v.contentDetails.duration,
      status: POST_STATUS.PUBLISHED
    }));
  }

  _formatVideoDetails(video, channel) {
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      subscriberCount: channel?.statistics?.subscriberCount,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      publishedAt: video.snippet.publishedAt
    };
  }

  _prepareTrackedVideoData(video) {
    return {
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
      lastViews: parseInt(video.statistics.viewCount) || 0,
      lastLikes: parseInt(video.statistics.likeCount) || 0,
      lastComments: parseInt(video.statistics.commentCount) || 0,
      channelId: video.snippet.channelId,
      channelName: video.snippet.channelTitle,
      publishedAt: new Date(video.snippet.publishedAt)
    };
  }

  extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

module.exports = new YouTubeVideoService();
