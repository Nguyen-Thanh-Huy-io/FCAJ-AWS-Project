const BaseFilter = require('../../../../core/query-pipeline/base.filter');

class TeamRoleFilter extends BaseFilter {
  apply(where, queryParams) {
    const { role } = queryParams;
    if (role && role !== 'All') {
      where.role = role.toUpperCase();
    }
  }
}

module.exports = TeamRoleFilter;
