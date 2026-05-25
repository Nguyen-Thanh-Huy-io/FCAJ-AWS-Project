const facebookGateway = require('./facebook.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const inboxRepository = require('../../../repositories/social/inbox.repository');
const { PLATFORMS, INBOX_STATUS } = require('../../../utils/constants');

class FacebookCommentService {
  async fetchChannelComments(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.FACEBOOK);
    if (!socialAccount || socialAccount.length === 0) throw new Error('Facebook account not connected');

    const account = socialAccount[0];
    const pageId = account.platformAccountId;
    const pageAccessToken = account.accessToken;

    // Ensure UnifiedInbox exists for this brand
    const inbox = await inboxRepository.findOrCreateInbox(brandId);

    // Fetch feed to get posts
    const feed = await facebookGateway.getPageFeed(pageId, pageAccessToken, 10);
    const inboxItems = [];

    for (const post of feed) {
      const comments = await facebookGateway.getPostComments(post.id, pageAccessToken);
      
      for (const comment of comments) {
        // Facebook comment format: { id, message, created_time, from: { id, name } }
        const authorId = comment.from?.id || 'unknown';
        const authorName = comment.from?.name || 'Facebook User';
        const authorAvatar = `https://graph.facebook.com/v25.0/${authorId}/picture?type=small`;

        const item = await inboxRepository.upsertInboxItem(
          { platformItemId: comment.id },
          {
            content: comment.message,
            authorName,
            authorAvatarUrl: authorAvatar,
            syncedAt: new Date(),
            socialAccountId: account.id
          },
          {
            inboxId: inbox.id,
            platform: PLATFORMS.FACEBOOK,
            type: 'COMMENT',
            platformItemId: comment.id,
            authorId,
            authorName,
            authorAvatarUrl: authorAvatar,
            content: comment.message,
            relatedPostId: post.id,
            platformCreatedAt: new Date(comment.created_time),
            syncedAt: new Date(),
            status: INBOX_STATUS.UNREAD,
            socialAccountId: account.id
          }
        );
        inboxItems.push(item);

        // Handle inner replies if any
        if (comment.comments && comment.comments.data) {
          for (const reply of comment.comments.data) {
            const replyAuthorId = reply.from?.id || 'unknown';
            const replyAuthorName = reply.from?.name || 'Facebook User';
            const replyAuthorAvatar = `https://graph.facebook.com/v25.0/${replyAuthorId}/picture?type=small`;

            await inboxRepository.upsertInboxItem(
              { platformItemId: reply.id },
              {
                content: reply.message,
                authorName: replyAuthorName,
                authorAvatarUrl: replyAuthorAvatar,
                socialAccountId: account.id
              },
              {
                inboxId: inbox.id,
                platform: PLATFORMS.FACEBOOK,
                type: 'COMMENT',
                platformItemId: reply.id,
                parentItemId: item.id,
                authorId: replyAuthorId,
                authorName: replyAuthorName,
                authorAvatarUrl: replyAuthorAvatar,
                content: reply.message,
                relatedPostId: post.id,
                platformCreatedAt: new Date(reply.created_time),
                syncedAt: new Date(),
                status: INBOX_STATUS.READ,
                socialAccountId: account.id
              }
            );
          }
        }
      }
    }

    // Update last sync time
    await inboxRepository.updateInboxLastSync(inbox.id);

    return inboxItems;
  }

  async replyToComment(brandId, parentCommentId, text) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.FACEBOOK);
    if (!socialAccount || socialAccount.length === 0) throw new Error('Facebook account not connected');

    const account = socialAccount[0];
    const pageAccessToken = account.accessToken;

    const response = await facebookGateway.replyToComment(parentCommentId, text, pageAccessToken);
    
    // Save reply to database
    const inbox = await inboxRepository.findOrCreateInbox(brandId);
    
    // Find parent in our DB to link
    const parentInDb = await inboxRepository.findInboxItemByPlatformId(parentCommentId);

    return inboxRepository.createInboxItem({
      inboxId: inbox.id,
      platform: PLATFORMS.FACEBOOK,
      type: 'COMMENT',
      platformItemId: response.id,
      parentItemId: parentInDb?.id,
      authorId: account.platformAccountId,
      authorName: account.displayName,
      authorAvatarUrl: account.profilePictureUrl,
      content: text,
      relatedPostId: parentInDb?.relatedPostId,
      platformCreatedAt: new Date(),
      syncedAt: new Date(),
      status: INBOX_STATUS.READ,
      socialAccountId: account.id
    });
  }
}

module.exports = new FacebookCommentService();
