const BaseSyncStrategy = require('./base.strategy');
const discordGateway = require('../../discord/discord.gateway');
const socialAccountRepository = require('../../../../repositories/social/social-account.repository');
const inboxRepository = require('../../../../repositories/social/inbox.repository');
const { PLATFORMS, INBOX_STATUS, INBOX_TYPES } = require('../../../../utils/constants');

class DiscordDirectMessageStrategy extends BaseSyncStrategy {
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
        // Discord Bot API không cho phép lấy danh sách tất cả DM channels.
        // Cách tiếp cận: lấy các authorId từ DM items đã có trong inbox
        // rồi sync tin nhắn mới cho từng user đó.
        const existingConversations = await inboxRepository.findManyAndCount({
          inboxId: inbox.id,
          platform: PLATFORMS.DISCORD,
          type: INBOX_TYPES.DIRECT_MESSAGE,
          parentItemId: null
        }, { skip: 0, take: 50 });

        const uniqueUserIds = [...new Set(
          existingConversations.items
            .map(item => item.authorId)
            .filter(Boolean)
        )];

        for (const userId of uniqueUserIds) {
          try {
            const dmChannel = await discordGateway.createDMChannel(userId);
            if (!dmChannel?.id) continue;

            const messages = await discordGateway.getChannelMessages(dmChannel.id);

            for (const message of messages) {
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
                  type: INBOX_TYPES.DIRECT_MESSAGE,
                  platformItemId: message.id,
                  authorId: message.author.id,
                  authorName: message.author.username,
                  authorAvatarUrl: discordGateway.buildAvatarUrl(message.author.id, message.author.avatar),
                  content: message.content,
                  relatedPostId: dmChannel.id, // DM Channel ID làm context
                  platformCreatedAt: new Date(message.timestamp),
                  syncedAt: new Date(),
                  status: INBOX_STATUS.UNREAD,
                  socialAccountId: account.id
                }
              );
              inboxItems.push(item);
            }
          } catch (dmErr) {
            console.error(`[DiscordDirectMessageStrategy] Failed sync for user ${userId}:`, dmErr.message);
          }
        }
      } catch (err) {
        console.error(`[DiscordDirectMessageStrategy] Sync failed for account ${account.id}:`, err.message);
      }
    }

    return inboxItems;
  }

  supportsReply(item) {
    return item.platform === PLATFORMS.DISCORD && item.type === INBOX_TYPES.DIRECT_MESSAGE;
  }

  async reply(brandId, parentPlatformItemId, text) {
    const parentInDb = await inboxRepository.findInboxItemByPlatformId(parentPlatformItemId);
    if (!parentInDb) throw new Error('Parent DM not found in database');

    const socialAccount = await socialAccountRepository.findById(parentInDb.socialAccountId);
    if (!socialAccount) throw new Error('Connected Discord account not found');

    // Ưu tiên dùng dmChannelId đã cache (relatedPostId), fallback tạo mới
    let dmChannelId = parentInDb.relatedPostId;

    if (!dmChannelId) {
      const dmChannel = await discordGateway.createDMChannel(parentInDb.authorId);
      dmChannelId = dmChannel.id;
    }

    if (!dmChannelId) throw new Error('Discord DM Channel ID could not be resolved');

    // Gửi tin nhắn vào DM channel
    const replyMessage = await discordGateway.sendChannelReply(dmChannelId, parentPlatformItemId, text);
    const inbox = await inboxRepository.findOrCreateInbox(brandId);

    return inboxRepository.createInboxItem({
      inboxId: inbox.id,
      platform: PLATFORMS.DISCORD,
      type: INBOX_TYPES.DIRECT_MESSAGE,
      platformItemId: replyMessage.id,
      parentItemId: parentInDb.id,
      authorId: socialAccount.platformAccountId,
      authorName: socialAccount.displayName || 'PubliCast Bot',
      authorAvatarUrl: socialAccount.profilePictureUrl,
      content: text,
      relatedPostId: dmChannelId,
      platformCreatedAt: new Date(replyMessage.timestamp),
      syncedAt: new Date(),
      status: INBOX_STATUS.READ,
      socialAccountId: socialAccount.id
    });
  }
}

module.exports = DiscordDirectMessageStrategy;
