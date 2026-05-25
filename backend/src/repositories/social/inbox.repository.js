const prisma = require('../../config/prisma');

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
          replies: {
             select: { authorId: true, authorName: true, authorAvatarUrl: true }
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
        inbox: true,
        assignedUser: { select: { id: true, name: true, avatarUrl: true } },
        repliedBy: { select: { id: true, name: true, avatarUrl: true } },
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

  async findOrCreateInbox(brandId) {
    let inbox = await prisma.unifiedInbox.findUnique({ where: { brandId } });
    if (!inbox) {
      inbox = await prisma.unifiedInbox.create({ data: { brandId } });
    }
    return inbox;
  }

  async upsertInboxItem(where, update, create) {
    if (update.authorAvatarUrl && update.authorAvatarUrl.length > 190) {
      update.authorAvatarUrl = update.authorAvatarUrl.substring(0, 190);
    }
    if (create.authorAvatarUrl && create.authorAvatarUrl.length > 190) {
      create.authorAvatarUrl = create.authorAvatarUrl.substring(0, 190);
    }
    return prisma.inboxItem.upsert({
      where,
      update,
      create
    });
  }

  async findInboxItemByPlatformId(platformItemId) {
    return prisma.inboxItem.findUnique({
      where: { platformItemId }
    });
  }

  async createInboxItem(data) {
    if (data.authorAvatarUrl && data.authorAvatarUrl.length > 190) {
      data.authorAvatarUrl = data.authorAvatarUrl.substring(0, 190);
    }
    return prisma.inboxItem.create({ data });
  }

  async updateInboxLastSync(inboxId) {
    return prisma.unifiedInbox.update({
      where: { id: inboxId },
      data: { lastSyncAt: new Date() }
    });
  }
}

module.exports = new InboxRepository();
