const teamRepository = require('../../repositories/workspace/team.repository');

class TeamService {
  /**
   * Get team members for a brand
   */
  async getTeamMembers(queryParams, brandId) {
    const {
      search,
      role,
      status,
      page = 1,
      limit = 50
    } = queryParams;

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (safePage - 1) * safeLimit;

    const where = { brandId };

    if (search && search.trim()) {
      const searchKey = search.trim();
      where.user = {
        OR: [
          { name: { contains: searchKey } },
          { email: { contains: searchKey } }
        ]
      };
    }

    if (role && role !== 'All') {
      where.role = role.toUpperCase(); // e.g., OWNER, ADMIN
    }

    if (status && status !== 'All') {
      where.status = status.toUpperCase(); // e.g., ACTIVE, PENDING
    }

    const { members, total } = await teamRepository.findManyAndCount(where, {
      skip,
      take: safeLimit
    });

    return {
      data: members.map(m => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        email: m.user.email,
        avatar: m.user.avatarUrl,
        role: this.formatRole(m.role),
        status: m.status.toLowerCase(),
        joinedDate: m.acceptedAt ? new Date(m.acceptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending',
        invitedBy: m.invitedBy.name
      })),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  formatRole(role) {
    // OWNER -> Owner, ADMIN -> Admin
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}

module.exports = new TeamService();
