const prisma = require('../config/prisma');

class PostRepository {
  /**
   * Find posts with filters and pagination
   * @param {Object} where - Prisma where conditions
   * @param {Object} options - { skip, take, orderBy }
   * @returns {Promise<Object>} { posts, total }
   */
  async findManyAndCount(where, options = {}) {
    const { skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = options;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    return { posts, total };
  }

  async findById(id) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });
  }
}

module.exports = new PostRepository();
