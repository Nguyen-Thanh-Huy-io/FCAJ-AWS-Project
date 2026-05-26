const teamRepository = require('../../repositories/workspace/team.repository');
const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const TeamSearchFilter = require('./team/filters/search.filter');
const TeamRoleFilter = require('./team/filters/role.filter');
const TeamStatusFilter = require('./team/filters/status.filter');

class TeamService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new TeamSearchFilter(),
      new TeamRoleFilter(),
      new TeamStatusFilter()
    ]);
  }

  /**
   * Get team members for a brand
   */
  async getTeamMembers(queryParams, brandId) {
    const { page = 1, limit = 50 } = queryParams;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (Math.max(1, parseInt(page) || 1) - 1) * safeLimit;

    const where = this.queryPipeline.apply({ brandId }, queryParams);
    const { members, total } = await teamRepository.findManyAndCount(where, { skip, take: safeLimit });

    return {
      data: members.map(m => this._formatTeamMember(m)),
      meta: { total, page: Math.max(1, parseInt(page) || 1), limit: safeLimit, totalPages: Math.ceil(total / safeLimit) }
    };
  }

  // ============= Private Helper Methods =============

  _formatTeamMember(m) {
    return {
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      avatar: m.user.avatarUrl,
      role: this._formatRoleName(m.role),
      status: m.status.toLowerCase(),
      joinedDate: m.acceptedAt 
        ? new Date(m.acceptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Pending',
      invitedBy: m.invitedBy.name
    };
  }

  _formatRoleName(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}

module.exports = new TeamService();
