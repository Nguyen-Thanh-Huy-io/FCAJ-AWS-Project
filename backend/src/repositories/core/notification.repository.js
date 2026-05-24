const prisma = require('../../config/prisma');

class NotificationRepository {
  /**
   * Find system notifications with filters
   */
  async findManyAndCount(where, options = {}) {
    const { skip = 0, take = 50, orderBy = { createdAt: 'desc' } } = options;

    const [notifications, total] = await Promise.all([
      prisma.systemNotification.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.systemNotification.count({ where })
    ]);

    return { notifications, total };
  }

  async markAsRead(id) {
    return prisma.systemNotification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(where) {
    return prisma.systemNotification.updateMany({
      where,
      data: { isRead: true }
    });
  }
}

module.exports = new NotificationRepository();
