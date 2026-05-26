const notificationRepository = require('../../repositories/core/notification.repository');
const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const NotificationCategoryFilter = require('./notification/filters/category.filter');
const NotificationIsReadFilter = require('./notification/filters/is-read.filter');
const { NOTIFICATION_TYPES, NOTIFICATION_LABELS } = require('../../utils/constants');

class NotificationService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new NotificationCategoryFilter(),
      new NotificationIsReadFilter()
    ]);
  }

  /**
   * Get notifications for a user/brand
   */
  async getNotifications(queryParams, userId, brandId) {
    const { page = 1, limit = 50 } = queryParams;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (Math.max(1, parseInt(page) || 1) - 1) * safeLimit;

    const initialWhere = { OR: [{ userId }, { brandId }, { isGlobal: true }] };
    const where = this.queryPipeline.apply(initialWhere, queryParams);

    const { notifications, total } = await notificationRepository.findManyAndCount(where, { skip, take: safeLimit });
    const categoryCounts = await this.getCategoryCounts(userId, brandId);

    return {
      data: notifications.map(n => this._formatNotification(n)),
      meta: {
        total,
        page: Math.max(1, parseInt(page) || 1),
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
      OR: [{ userId }, { brandId }, { isGlobal: true }],
      isRead: false
    };
    return await notificationRepository.markAllAsRead(where);
  }

  async getCategoryCounts(userId, brandId) {
    const baseWhere = { OR: [{ userId }, { brandId }, { isGlobal: true }], isRead: false };
    const categories = Object.values(NOTIFICATION_TYPES);
    const counts = { all: 0 };

    await Promise.all(categories.map(async (cat) => {
      const count = await notificationRepository.count({ ...baseWhere, type: cat });
      counts[cat] = count;
      counts.all += count;
    }));

    return counts;
  }

  // ============= Private Helper Methods =============

  _formatNotification(n) {
    return {
      id: n.id,
      title: n.title,
      desc: n.message,
      category: n.type,
      isRead: n.isRead,
      action: this._getActionLabel(n.type),
      actionUrl: n.actionUrl,
      createdAt: n.createdAt,
      time: this._formatTimeAgo(n.createdAt),
      bg: this._getCategoryColor(n.type)
    };
  }

  _getActionLabel(type) {
    const labels = {
      [NOTIFICATION_TYPES.STREAM]: NOTIFICATION_LABELS.ACTION.MONITOR,
      [NOTIFICATION_TYPES.CONTENT]: NOTIFICATION_LABELS.ACTION.REVIEW,
      [NOTIFICATION_TYPES.PLATFORM]: NOTIFICATION_LABELS.ACTION.RECONNECT,
      [NOTIFICATION_TYPES.TEAM]: NOTIFICATION_LABELS.ACTION.VIEW_TEAM,
      [NOTIFICATION_TYPES.SYSTEM]: NOTIFICATION_LABELS.ACTION.MANAGE
    };
    return labels[type] || NOTIFICATION_LABELS.ACTION.VIEW;
  }

  _getCategoryColor(type) {
    const colors = {
      [NOTIFICATION_TYPES.STREAM]: '#DC2626',
      [NOTIFICATION_TYPES.CONTENT]: '#D97706',
      [NOTIFICATION_TYPES.PLATFORM]: '#D97706',
      [NOTIFICATION_TYPES.TEAM]: '#374151',
      [NOTIFICATION_TYPES.SYSTEM]: '#6B7280'
    };
    return colors[type] || '#0A0A0A';
  }

  _formatTimeAgo(date) {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return NOTIFICATION_LABELS.TIME.JUST_NOW;
    if (minutes < 60) return `${minutes} ${NOTIFICATION_LABELS.TIME.MIN_AGO}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}${NOTIFICATION_LABELS.TIME.HOUR_AGO}`;
    return `${Math.floor(hours / 24)}${NOTIFICATION_LABELS.TIME.DAY_AGO}`;
  }
}

module.exports = new NotificationService();
