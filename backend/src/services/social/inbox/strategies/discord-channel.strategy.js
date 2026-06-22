const BaseSyncStrategy = require('./base.strategy');
const discordGateway = require('../../discord/discord.gateway');
const socialAccountRepository = require('../../../../repositories/social/social-account.repository');
const inboxRepository = require('../../../../repositories/social/inbox.repository');
const { PLATFORMS, INBOX_STATUS, INBOX_TYPES } = require('../../../../utils/constants');

class DiscordChannelMessageStrategy extends BaseSyncStrategy {
  supports(platform) {
    return platform.toUpperCase() === PLATFORMS.DISCORD;
  }

  async sync(brandId, inbox) {
    const socialAccounts = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.DISCORD);
    if (!socialAccounts || socialAccounts.length === 0) return [];

    const inboxItems = [];

    for (const account of socialAccounts) {
      if (!account.isConnected) continue;

      try {
        // Lấy channelId từ webhook URL đã cấu hình (lưu trong accessToken)
        const webhookInfo = await discordGateway.validateWebhook(account.accessToken);
        const channelId = webhookInfo.channel_id;
        if (!channelId) continue;

        const messages = await discordGateway.getChannelMessages(channelId);

        for (const message of messages) {
          // Bỏ qua tin nhắn của Bot hoặc của chính tài khoản đã kết nối
          if (message.author.bot || message.author.id === account.platformAccountId) continue;

          const item = await inboxRepository.upsertInboxItem(
            { platformItemId: message.id },
            {
              content: message.content,
              authorName: message.author.username,
              authorAvatarUrl: discordGateway.buildAvatarUrl(message.author.id, message.author.avatar),
              syncedAt: new Date(),
              socialAccountId: account.id
            },
            {
              inboxId: inbox.id,
              platform: PLATFORMS.DISCORD,
              type: INBOX_TYPES.COMMENT,
              platformItemId: message.id,
              authorId: message.author.id,
              authorName: message.author.username,
              authorAvatarUrl: discordGateway.buildAvatarUrl(message.author.id, message.author.avatar),
              content: message.content,
              relatedPostId: channelId, // Lưu channel ID làm context để reply
              platformCreatedAt: new Date(message.timestamp),
              syncedAt: new Date(),
              status: INBOX_STATUS.UNREAD,
              socialAccountId: account.id
            }
          );
          inboxItems.push(item);
        }
      } catch (err) {
        console.error(`[DiscordChannelMessageStrategy] Sync failed for account ${account.id}:`, err.message);
      }
    }

    return inboxItems;
  }

  supportsReply(item) {
    return item.platform === PLATFORMS.DISCORD && item.type === INBOX_TYPES.COMMENT;
  }

  async reply(brandId, parentPlatformItemId, text) {
    const parentInDb = await inboxRepository.findInboxItemByPlatformId(parentPlatformItemId);
    if (!parentInDb) throw new Error('Parent message not found in database');

    const socialAccount = await socialAccountRepository.findById(parentInDb.socialAccountId);
    if (!socialAccount) throw new Error('Connected Discord account not found');

    // Ưu tiên dùng relatedPostId (channel ID đã cache khi sync)
    // Fallback: resolve lại từ webhook nếu chưa có
    let channelId = parentInDb.relatedPostId;

    if (!channelId) {
      const webhookInfo = await discordGateway.validateWebhook(socialAccount.accessToken);
      channelId = webhookInfo.channel_id;
    }

    if (!channelId) throw new Error('Discord Channel ID could not be resolved');

    const replyMessage = await discordGateway.sendChannelReply(channelId, parentPlatformItemId, text);
    const inbox = await inboxRepository.findOrCreateInbox(brandId);

    return inboxRepository.createInboxItem({
      inboxId: inbox.id,
      platform: PLATFORMS.DISCORD,
      type: INBOX_TYPES.COMMENT,
      platformItemId: replyMessage.id,
      parentItemId: parentInDb.id,
      authorId: socialAccount.platformAccountId,
      authorName: socialAccount.displayName || 'PubliCast Bot',
      authorAvatarUrl: socialAccount.profilePictureUrl,
      content: text,
      relatedPostId: channelId,
      platformCreatedAt: new Date(replyMessage.timestamp),
      syncedAt: new Date(),
      status: INBOX_STATUS.READ,
      socialAccountId: socialAccount.id
    });
  }
}

module.exports = DiscordChannelMessageStrategy;
