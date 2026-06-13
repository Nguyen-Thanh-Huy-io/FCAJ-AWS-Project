const BaseFilter = require('../../../../core/query-pipeline/base.filter');

class TeamRoleFilter extends BaseFilter {
  apply(where, queryParams) {
    const { role } = queryParams;
    if (role && role !== 'All') {
      let dbRole = role.toUpperCase();
      if (dbRole === 'MEMBER') dbRole = 'USER';
      where.role = dbRole;
    }
  }
}

module.exports = TeamRoleFilter;
