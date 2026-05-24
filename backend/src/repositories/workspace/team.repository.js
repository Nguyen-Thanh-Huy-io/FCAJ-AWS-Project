const prisma = require('../../config/prisma');

class TeamRepository {
  /**
   * Find team members with filters
   */
  async findManyAndCount(where, options = {}) {
    const { skip = 0, take = 50, orderBy = { createdAt: 'desc' } } = options;

    const [members, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          },
          invitedBy: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.team.count({ where })
    ]);

    return { members, total };
  }

  async findById(id) {
    return prisma.team.findUnique({
      where: { id },
      include: { user: true }
    });
  }
}

module.exports = new TeamRepository();
