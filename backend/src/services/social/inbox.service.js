const inboxRepository = require('../../repositories/social/inbox.repository');
const socialPlatformFactory = require('./social-platform.factory');
const socialAccountRepository = require('../../repositories/social/social-account.repository');
const { PLATFORMS, INBOX_STATUS, INBOX_TYPES, SOCIAL_TECHNICAL } = require('../../utils/constants');

const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const InboxSearchFilter = require('./inbox/filters/search.filter');
const InboxPlatformFilter = require('./inbox/filters/platform.filter');
const InboxTabFilter = require('./inbox/filters/tab.filter');
const InboxStatusFilter = require('./inbox/filters/status.filter');

class InboxService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new InboxSearchFilter(),
      new InboxPlatformFilter(),
      new InboxTabFilter(),
      new InboxStatusFilter()
    ]);
  }

  /**
   * Get filtered inbox items for a brand
   */
  async getInboxItems(queryParams, brandId) {
    const { page = 1, limit = 20 } = queryParams;
    const { skip, take } = this._getPagination(page, limit);

    const initialWhere = { inbox: { brandId }, parentItemId: null };
    const where = this.queryPipeline.apply(initialWhere, queryParams);

    const { items, total } = await inboxRepository.findManyAndCount(where, { skip, take });

    return {
      data: items.map(item => this._formatInboxListItem(item)),
      meta: {
        total,
        page: Math.max(1, parseInt(page) || 1),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    };
  }

  async getConversationThread(itemId) {
    const item = await inboxRepository.findById(itemId);
    if (!item) throw { status: 404, message: 'Item not found' };

    const myAccountId = await this._getMyPlatformAccountId(item);
    const videoContext = await this._getVideoContext(item);

    const thread = [
      this._formatThreadMessage(item, myAccountId),
      ...(item.replies || []).map(r => this._formatThreadMessage(r, myAccountId))
    ];

    return { item, thread, videoContext };
  }

  async syncPlatformComments(brandId, platform) {
    try {
      const service = socialPlatformFactory.getService(platform);
      return await service.fetchChannelComments(brandId);
    } catch (e) {
      console.error(`Failed to sync platform comments for ${platform}:`, e.message);
      return [];
    }
  }

  async replyToItem(brandId, itemId, text) {
    const item = await inboxRepository.findById(itemId);
    if (!item) throw new Error('Item not found');

    const service = socialPlatformFactory.getService(item.platform);
    const reply = await service.replyToComment(brandId, item.platformItemId, text);
    
    await inboxRepository.updateStatus(itemId, INBOX_STATUS.READ);
    return reply;
  }

  async updateItemStatus(itemId, status) {
    const item = await inboxRepository.findById(itemId);
    if (!item) throw new Error('Item not found');
    return await inboxRepository.updateStatus(itemId, status.toUpperCase());
  }

  // ============= Private Helper Methods =============

  _getPagination(page, limit) {
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return { skip: (safePage - 1) * safeLimit, take: safeLimit };
  }

  _formatInboxListItem(item) {
    const participants = this._aggregateParticipants(item);
    return {
      id: item.id,
      platform: this._formatPlatformName(item.platform),
      user: this._formatDisplayName(participants),
      participants: participants.slice(0, 3),
      avatar: item.authorAvatarUrl || item.authorName.charAt(0),
      preview: item.content,
      time: this._formatTimeAgo(item.platformCreatedAt),
      unread: item.status === INBOX_STATUS.UNREAD,
      assigned: item.assignedUser?.name || null,
      status: item.status.toLowerCase(),
      type: item.type.toLowerCase()
    };
  }

  _aggregateParticipants(item) {
    const participants = [{ name: item.authorName, avatar: item.authorAvatarUrl }];
    const seenNames = new Set([item.authorName]);

    (item.replies || []).forEach(r => {
      if (r.authorId !== item.authorId && !seenNames.has(r.name)) {
        seenNames.add(r.name);
        participants.push({ name: r.authorName, avatar: r.authorAvatarUrl });
      }
    });
    return participants;
  }

  _formatDisplayName(participants) {
    if (participants.length === 0) return 'Unknown';
    if (participants.length === 1) return participants[0].name;
    let name = `${participants[0].name} and ${participants[1].name}`;
    if (participants.length > 2) name += ` and ${participants.length - 2} others`;
    return name;
  }

  async _getMyPlatformAccountId(item) {
    if (item.socialAccountId) {
      const sa = await socialAccountRepository.findById(item.socialAccountId);
      return sa?.platformAccountId;
    }
    const sa = await socialAccountRepository.findByBrandAndPlatformFirst(item.inbox.brandId, item.platform);
    return sa?.platformAccountId;
  }

  async _getVideoContext(item) {
    if (!item.relatedPostId) return null;
    try {
      const service = socialPlatformFactory.getService(item.platform);
      return await service.getVideoDetails(item.inbox.brandId, item.relatedPostId);
    } catch (e) {
      return null;
    }
  }

  _formatThreadMessage(msg, myAccountId) {
    const isMe = msg.repliedByUserId || msg.authorId === myAccountId;
    return {
      id: msg.id,
      from: isMe ? SOCIAL_TECHNICAL.INBOX_LABELS.ME : SOCIAL_TECHNICAL.INBOX_LABELS.THEM,
      text: msg.content,
      time: new Date(msg.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: msg.authorName,
      avatar: msg.authorAvatarUrl
    };
  }

  _formatPlatformName(p) {
    return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : 'Unknown';
  }

  _formatTimeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }
}

module.exports = new InboxService();
