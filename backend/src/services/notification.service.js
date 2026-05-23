const notificationRepository = require('../repositories/notification.repository');

class NotificationService {
  /**
   * Get notifications for a user/brand
   */
  async getNotifications(queryParams, userId, brandId) {
    const {
      category,
      isRead,
      page = 1,
      limit = 50
    } = queryParams;

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (safePage - 1) * safeLimit;

    // Filter by user OR brand OR global
    const where = {
      OR: [
        { userId },
        { brandId },
        { isGlobal: true }
      ]
    };

    if (category && category !== 'all') {
      where.type = category;
    }

    if (isRead !== undefined && isRead !== '') {
      where.isRead = isRead === 'true';
    }

    const { notifications, total } = await notificationRepository.findManyAndCount(where, {
      skip,
      take: safeLimit
    });

    // Get count for each category to update sidebar
    const categoryCounts = await this.getCategoryCounts(userId, brandId);

    return {
      data: notifications.map(n => ({
        id: n.id,
        title: n.title,
        desc: n.message,
        category: n.type,
        isRead: n.isRead,
        action: this.getActionLabel(n.type),
        actionUrl: n.actionUrl,
        createdAt: n.createdAt,
        time: this.formatTimeAgo(n.createdAt),
        bg: this.getCategoryColor(n.type)
      })),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        categoryCounts
      }
    };
  }

  async markAsRead(id) {
    return await notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId, brandId) {
    const where = {
      OR: [
        { userId },
        { brandId },
        { isGlobal: true }
      ],
      isRead: false
    };
    return await notificationRepository.markAllAsRead(where);
  }

  async getCategoryCounts(userId, brandId) {
    const prisma = require('../config/prisma');
    const baseWhere = {
      OR: [{ userId }, { brandId }, { isGlobal: true }],
      isRead: false
    };

    const categories = ['stream', 'content', 'team', 'platform', 'system'];
    const counts = { all: 0 };

    await Promise.all(categories.map(async (cat) => {
      const count = await prisma.systemNotification.count({
        where: { ...baseWhere, type: cat }
      });
      counts[cat] = count;
      counts.all += count;
    }));

    return counts;
  }

  getActionLabel(type) {
    const labels = {
      stream: 'Monitor',
      content: 'Review',
      platform: 'Reconnect',
      team: 'View Team',
      system: 'Manage'
    };
    return labels[type] || 'View';
  }

  getCategoryColor(type) {
    const colors = {
      stream: '#DC2626',
      content: '#D97706',
      platform: '#D97706',
      team: '#374151',
      system: '#6B7280'
    };
    return colors[type] || '#0A0A0A';
  }

  formatTimeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}

module.exports = new NotificationService();
