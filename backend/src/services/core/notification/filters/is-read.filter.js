const BaseFilter = require('../../../../core/query-pipeline/base.filter');

class NotificationIsReadFilter extends BaseFilter {
  apply(where, queryParams) {
    const { isRead } = queryParams;
    if (isRead !== undefined && isRead !== '') {
      where.isRead = isRead === 'true';
    }
  }
}

module.exports = NotificationIsReadFilter;
