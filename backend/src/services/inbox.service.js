const inboxRepository = require('../repositories/inbox.repository');

class InboxService {
  /**
   * Get filtered inbox items for a brand
   */
  async getInboxItems(queryParams, brandId) {
    const {
      search,
      platform,
      tab, // All, Unread, Comments, DMs, Mentions
      status, // open, resolved, spam
      page = 1,
      limit = 20
    } = queryParams;

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    // Build where
    const where = {
      inbox: { brandId }
    };

    if (search && search.trim()) {
      const searchKey = search.trim();
      where.OR = [
        { authorName: { contains: searchKey } },
        { content: { contains: searchKey } }
      ];
    }

    if (platform && platform !== 'All') {
      where.platform = platform.toUpperCase(); // e.g., FACEBOOK, YOUTUBE
    }

    // Handle Tab Logic
    if (tab === 'Unread') {
      where.status = 'UNREAD';
    } else if (tab === 'Comments') {
      where.type = 'COMMENT';
    } else if (tab === 'DMs') {
      where.type = 'DIRECT_MESSAGE';
    } else if (tab === 'Mentions') {
      where.type = 'MENTION';
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase(); // e.g., OPEN, RESOLVED, SPAM
    } else if (!tab) {
      // Default to OPEN if no status or tab specified
      // where.status = 'OPEN';
    }

    const { items, total } = await inboxRepository.findManyAndCount(where, {
      skip,
      take: safeLimit
    });

    return {
      data: items.map(item => ({
        id: item.id,
        platform: this.formatPlatform(item.platform),
        user: item.authorName,
        avatar: item.authorAvatarUrl || item.authorName.charAt(0),
        preview: item.content,
        time: this.formatTimeAgo(item.platformCreatedAt),
        unread: item.status === 'UNREAD',
        assigned: item.assignedUser?.name || null,
        status: item.status.toLowerCase(),
        type: item.type.toLowerCase()
      })),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  async getConversationThread(itemId) {
    const item = await inboxRepository.findById(itemId);
    if (!item) throw { status: 404, message: 'Item not found' };

    // Format current item and its replies as a single thread
    const thread = [
      {
        id: item.id,
        from: 'them',
        text: item.content,
        time: new Date(item.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: item.authorName,
        avatar: item.authorAvatarUrl
      },
      ...(item.replies || []).map(r => ({
        id: r.id,
        from: r.authorId === item.authorId ? 'them' : 'me',
        text: r.content,
        time: new Date(r.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: r.authorName
      }))
    ];

    return {
      item,
      thread
    };
  }

  formatPlatform(p) {
    // YOUTUBE -> YouTube
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }

  formatTimeAgo(date) {
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
