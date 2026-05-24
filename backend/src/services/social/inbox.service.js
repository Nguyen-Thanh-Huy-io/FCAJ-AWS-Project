const inboxRepository = require('../../repositories/social/inbox.repository');
const socialPlatformFactory = require('./social-platform.factory');
const prisma = require('../../config/prisma');
const { PLATFORMS, INBOX_STATUS, INBOX_TYPES } = require('../../utils/constants');

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
      inbox: { brandId },
      parentItemId: null // Only top-level items in list
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
      where.status = INBOX_STATUS.UNREAD;
    } else if (tab === 'Unresolved') {
      where.status = { in: [INBOX_STATUS.UNREAD, INBOX_STATUS.READ, INBOX_STATUS.OPEN] };
    } else if (tab === 'Comments') {
      where.type = INBOX_TYPES.COMMENT;
    } else if (tab === 'DMs') {
      where.type = INBOX_TYPES.DIRECT_MESSAGE;
    } else if (tab === 'Mentions') {
      where.type = INBOX_TYPES.MENTION;
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase(); // e.g., OPEN, RESOLVED, SPAM
    }

    const { items, total } = await inboxRepository.findManyAndCount(where, {
      skip,
      take: safeLimit
    });

    return {
      data: items.map(item => {
        // Aggregate participants from replies
        const participants = [
          { name: item.authorName, avatar: item.authorAvatarUrl }
        ];
        
        const repliers = (item.replies || [])
          .filter(r => r.authorId !== item.authorId) // Only unique repliers
          .map(r => ({ name: r.authorName, avatar: r.authorAvatarUrl }));
        
        // Use a Set to ensure unique names for participants display
        const uniqueRepliers = [];
        const seenNames = new Set([item.authorName]);
        for(const r of repliers) {
           if(!seenNames.has(r.name)) {
              seenNames.add(r.name);
              uniqueRepliers.push(r);
           }
        }
        participants.push(...uniqueRepliers);

        const participantNames = participants.map(p => p.name);
        let displayName = participantNames[0];
        if (participantNames.length > 1) {
           displayName = `${participantNames[0]} and ${participantNames[1]}`;
           if (participantNames.length > 2) displayName += ` and ${participantNames.length - 2} others`;
        }

        return {
          id: item.id,
          platform: this.formatPlatform(item.platform),
          user: displayName,
          participants: participants.slice(0, 3), // Return top 3 for avatar stack
          avatar: item.authorAvatarUrl || item.authorName.charAt(0),
          preview: item.content,
          time: this.formatTimeAgo(item.platformCreatedAt),
          unread: item.status === INBOX_STATUS.UNREAD,
          assigned: item.assignedUser?.name || null,
          status: item.status.toLowerCase(),
          type: item.type.toLowerCase()
        };
      }),
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

    // More robust identification of "me"
    let myAccountId = null;
    if (item.socialAccountId) {
       const sa = await prisma.socialAccount.findUnique({ where: { id: item.socialAccountId }, select: { platformAccountId: true } });
       myAccountId = sa?.platformAccountId;
    } else {
       // Fallback: search by brand and platform
       const sa = await prisma.socialAccount.findFirst({ 
          where: { brandId: item.inbox.brandId, platform: item.platform },
          select: { platformAccountId: true }
       });
       myAccountId = sa?.platformAccountId;
    }

    const isMe = (authorId, authorName) => {
       if (myAccountId && authorId === myAccountId) return true;
       // Extreme fallback for CodeChick specifically as requested
       if (authorName === 'CodeChick') return true;
       return false;
    };

    let videoContext = null;
    if (item.relatedPostId) {
       try {
          const brandId = item.inbox.brandId;
          const service = socialPlatformFactory.getService(item.platform);
          videoContext = await service.getVideoDetails(brandId, item.relatedPostId);
       } catch (e) {
          console.error("Failed to fetch video context:", e.message);
       }
    }

    // Format current item and its replies as a single thread
    const thread = [
      {
        id: item.id,
        from: isMe(item.authorId, item.authorName) ? 'me' : 'them',
        text: item.content,
        time: new Date(item.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: item.authorName,
        avatar: item.authorAvatarUrl
      },
      ...(item.replies || []).map(r => ({
        id: r.id,
        from: (r.platformItemId.startsWith('me-') || r.repliedByUserId || isMe(r.authorId, r.authorName)) ? 'me' : 'them',
        text: r.content,
        time: new Date(r.platformCreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: r.authorName,
        avatar: r.authorAvatarUrl
      }))
    ];

    return {
      item,
      thread,
      videoContext
    };
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
    
    // Update parent status to READ
    await inboxRepository.updateStatus(itemId, INBOX_STATUS.READ);
    
    return reply;
  }

  async updateItemStatus(itemId, status) {
    const item = await inboxRepository.findById(itemId);
    if (!item) throw new Error('Item not found');

    return await inboxRepository.updateStatus(itemId, status.toUpperCase());
  }

  formatPlatform(p) {
    // YOUTUBE -> YouTube
    if (!p) return 'Unknown';
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
