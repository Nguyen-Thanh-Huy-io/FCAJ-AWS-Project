const BaseFilter = require('../../../../core/query-pipeline/base.filter');

class MediaLibrarySearchFilter extends BaseFilter {
  apply(where, queryParams) {
    const { search } = queryParams;
    if (search && search.trim()) {
      where.filename = { contains: search.trim() };
    }
  }
}

module.exports = MediaLibrarySearchFilter;
