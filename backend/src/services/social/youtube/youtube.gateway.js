const { google } = require('googleapis');

class YouTubeGateway {
  /**
   * Lấy thông tin kênh từ Google API
   */
  async getChannelList(auth, mine = true, id = null) {
    const youtube = google.youtube({ version: 'v3', auth });
    const params = {
      part: 'snippet,statistics,contentDetails'
    };
    if (mine) {
      params.mine = true;
    } else {
      params.id = id;
    }
    return youtube.channels.list(params);
  }

  /**
   * Lấy danh sách video từ Playlist (ví dụ: Playlist Uploads)
   */
  async getPlaylistItems(auth, playlistId, limit, pageToken) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: parseInt(limit) || 10,
      pageToken
    });
  }

  /**
   * Lấy chi tiết thông tin các video
   */
  async getVideosList(auth, videoIds) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.videos.list({
      part: 'statistics,contentDetails,snippet',
      id: videoIds
    });
  }

  /**
   * Tìm kiếm kênh YouTube
   */
  async searchChannels(auth, query, maxResults = 5) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'channel',
      maxResults
    });
  }

  /**
   * Lấy danh sách Comments từ Channel
   */
  async getCommentThreads(auth, channelId, maxResults = 100) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.commentThreads.list({
      part: 'snippet,replies',
      allThreadsRelatedToChannelId: channelId,
      maxResults,
      order: 'time',
      moderationStatus: 'published'
    });
  }

  /**
   * Thêm bình luận phản hồi (Reply)
   */
  async insertCommentReply(auth, parentId, text) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.comments.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          parentId,
          textOriginal: text
        }
      }
    });
  }

  /**
   * Truy vấn báo cáo số liệu phân tích từ YouTube Analytics
   */
  async getAnalyticsReportQuery(auth, params) {
    const analytics = google.youtubeAnalytics({ version: 'v2', auth });
    return analytics.reports.query(params);
  }
}

module.exports = new YouTubeGateway();
