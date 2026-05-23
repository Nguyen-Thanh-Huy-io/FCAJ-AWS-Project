const prisma = require('../config/prisma');

class InboxRepository {
  /**
   * Find inbox items with filters and pagination
   * @param {Object} where - Prisma where conditions
   * @param {Object} options - { skip, take, orderBy }
   * @returns {Promise<Object>} { items, total }
   */
  async findManyAndCount(where, options = {}) {
    const { skip = 0, take = 20, orderBy = { platformCreatedAt: 'desc' } } = options;

    const [items, total] = await Promise.all([
      prisma.inboxItem.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          assignedUser: {
            select: { id: true, name: true, avatarUrl: true }
          },
          repliedBy: {
            select: { id: true, name: true, avatarUrl: true }
          },
          post: {
            select: { id: true, title: true, mediaThumbnailUrls: true, publishedAt: true }
          }
        }
      }),
      prisma.inboxItem.count({ where })
    ]);

    return { items, total };
  }

  async findById(id) {
    return prisma.inboxItem.findUnique({
      where: { id },
      include: {
        assignedUser: { select: { id: true, name: true, avatarUrl: true } },
        repliedBy: { select: { id: true, name: true, avatarUrl: true } },
        post: true,
        replies: {
          orderBy: { platformCreatedAt: 'asc' }
        }
      }
    });
  }

  async updateStatus(id, status) {
    return prisma.inboxItem.update({
      where: { id },
      data: { status }
    });
  }
}

module.exports = new InboxRepository();
