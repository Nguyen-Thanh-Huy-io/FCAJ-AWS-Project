const youtubeGateway = require('./youtube.gateway');
const googleOAuthService = require('../google-oauth.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const trackedVideoRepository = require('../../../repositories/social/tracked-video.repository');
const { PLATFORMS } = require('../../../utils/constants');

class YouTubeVideoService {
  async getPublishedVideos(brandId, pageToken = null, limit = 10) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const account = socialAccount[0];
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: account.accessToken });
    
    let uploadsId = account.youtubeChannel?.uploadsPlaylistId;
    if (!uploadsId) {
      const channelRes = await youtubeGateway.getChannelList(auth, true);
      uploadsId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;
    }

    const playlistRes = await youtubeGateway.getPlaylistItems(auth, uploadsId, limit, pageToken);

    if (!playlistRes.data.items || playlistRes.data.items.length === 0) {
      return { videos: [], nextPageToken: null, prevPageToken: null };
    }

    const videoIds = playlistRes.data.items.map(item => item.contentDetails.videoId).join(',');

    const videoDetails = await youtubeGateway.getVideosList(auth, videoIds);

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

  async trackVideo(brandId, videoUrl) {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) {
      throw new Error('Please connect a YouTube account first to track videos');
    }

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const response = await youtubeGateway.getVideosList(auth, videoId);

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return trackedVideoRepository.upsertTrackedVideo(brandId, videoId, {
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
      lastViews: parseInt(video.statistics.viewCount) || 0,
      lastLikes: parseInt(video.statistics.likeCount) || 0,
      lastComments: parseInt(video.statistics.commentCount) || 0,
      channelId: video.snippet.channelId,
      channelName: video.snippet.channelTitle,
      publishedAt: new Date(video.snippet.publishedAt)
    });
  }

  async getTrackedVideos(brandId) {
    return trackedVideoRepository.getTrackedVideos(brandId);
  }

  async getVideoDetails(brandId, videoId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) return null;

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const response = await youtubeGateway.getVideosList(auth, videoId);

    if (!response.data.items || response.data.items.length === 0) return null;

    const video = response.data.items[0];
    const channelRes = await youtubeGateway.getChannelList(auth, false, video.snippet.channelId);

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      subscriberCount: channelRes.data.items?.[0]?.statistics?.subscriberCount,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      publishedAt: video.snippet.publishedAt
    };
  }

  async searchChannel(brandId, query) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: socialAccount[0].accessToken });

    const response = await youtubeGateway.searchChannels(auth, query);

    return response.data.items.map(item => ({
      channelId: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  }

  extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

module.exports = new YouTubeVideoService();
