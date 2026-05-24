const youtubeGateway = require('./youtube.gateway');
const googleOAuthService = require('../google-oauth.service');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const inboxRepository = require('../../../repositories/social/inbox.repository');
const { PLATFORMS, INBOX_STATUS } = require('../../../utils/constants');

class YouTubeCommentService {
  async fetchChannelComments(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const account = socialAccount[0];
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: account.accessToken });

    // Ensure UnifiedInbox exists for this brand
    const inbox = await inboxRepository.findOrCreateInbox(brandId);

    const response = await youtubeGateway.getCommentThreads(auth, account.platformAccountId);

    if (!response.data.items) return [];

    const inboxItems = [];
    for (const thread of response.data.items) {
      const comment = thread.snippet.topLevelComment;
      
      // Upsert Main Comment
      const item = await inboxRepository.upsertInboxItem(
        { platformItemId: comment.id },
        {
          content: comment.snippet.textDisplay,
          authorName: comment.snippet.authorDisplayName,
          authorAvatarUrl: comment.snippet.authorProfileImageUrl,
          syncedAt: new Date(),
          socialAccountId: account.id
        },
        {
          inboxId: inbox.id,
          platform: PLATFORMS.YOUTUBE,
          type: 'COMMENT',
          platformItemId: comment.id,
          authorId: comment.snippet.authorChannelId.value,
          authorName: comment.snippet.authorDisplayName,
          authorAvatarUrl: comment.snippet.authorProfileImageUrl,
          content: comment.snippet.textDisplay,
          relatedPostId: comment.snippet.videoId,
          platformCreatedAt: new Date(comment.snippet.publishedAt),
          syncedAt: new Date(),
          status: INBOX_STATUS.UNREAD,
          socialAccountId: account.id
        }
      );
      inboxItems.push(item);

      // Handle Replies in thread if any
      if (thread.replies && thread.replies.comments) {
        for (const reply of thread.replies.comments) {
          await inboxRepository.upsertInboxItem(
            { platformItemId: reply.id },
            {
              content: reply.snippet.textDisplay,
              authorName: reply.snippet.authorDisplayName,
              authorAvatarUrl: reply.snippet.authorProfileImageUrl,
              socialAccountId: account.id
            },
            {
              inboxId: inbox.id,
              platform: PLATFORMS.YOUTUBE,
              type: 'COMMENT',
              platformItemId: reply.id,
              parentItemId: item.id,
              authorId: reply.snippet.authorChannelId.value,
              authorName: reply.snippet.authorDisplayName,
              authorAvatarUrl: reply.snippet.authorProfileImageUrl,
              content: reply.snippet.textDisplay,
              relatedPostId: reply.snippet.videoId,
              platformCreatedAt: new Date(reply.snippet.publishedAt),
              syncedAt: new Date(),
              status: INBOX_STATUS.READ,
              socialAccountId: account.id
            }
          );
        }
      }
    }

    // Update last sync time
    await inboxRepository.updateInboxLastSync(inbox.id);

    return inboxItems;
  }

  async replyToComment(brandId, parentCommentId, text) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) throw new Error('YouTube account not connected');

    const account = socialAccount[0];
    const auth = googleOAuthService.createClient();
    auth.setCredentials({ access_token: account.accessToken });

    const response = await youtubeGateway.insertCommentReply(auth, parentCommentId, text);
    const newComment = response.data;

    // Save our reply to database
    const inbox = await inboxRepository.findOrCreateInbox(brandId);
    
    // Find parent in our DB to link
    const parentInDb = await inboxRepository.findInboxItemByPlatformId(parentCommentId);

    return inboxRepository.createInboxItem({
      inboxId: inbox.id,
      platform: PLATFORMS.YOUTUBE,
      type: 'COMMENT',
      platformItemId: newComment.id,
      parentItemId: parentInDb?.id,
      authorId: account.platformAccountId,
      authorName: account.displayName,
      authorAvatarUrl: account.profilePictureUrl,
      content: newComment.snippet.textDisplay,
      relatedPostId: parentInDb?.relatedPostId,
      platformCreatedAt: new Date(newComment.snippet.publishedAt),
      syncedAt: new Date(),
      status: INBOX_STATUS.READ
    });
  }
}

module.exports = new YouTubeCommentService();
