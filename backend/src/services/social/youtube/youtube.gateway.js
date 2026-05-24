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

  /**
   * Upload video lên YouTube
   */
  async uploadVideo(auth, videoStream, metadata) {
    const youtube = google.youtube({ version: 'v3', auth });
    const { 
      title, 
      description, 
      privacyStatus = 'private', 
      categoryId = '22',
      selfDeclaredMadeForKids = false,
      tags = []
    } = metadata;

    return youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title,
          description,
          categoryId,
          tags
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids
        }
      },
      media: {
        body: videoStream
      }
    });
  }

  /**
   * Lấy danh sách Playlist của kênh
   */
  async getPlaylists(auth, limit = 50) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.playlists.list({
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: limit
    });
  }

  /**
   * Thêm video vào Playlist
   */
  async addVideoToPlaylist(auth, playlistId, videoId) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.playlistItems.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId
          }
        }
      }
    });
  }

  /**
   * Đăng bình luận mới lên video (Top-level comment)
   */
  async insertCommentThread(auth, videoId, text) {
    const youtube = google.youtube({ version: 'v3', auth });
    return youtube.commentThreads.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      }
    });
  }
}

module.exports = new YouTubeGateway();
