const searchRepository = require('../repositories/search.repository');

class SearchService {
  /**
   * Search all entities based on user role and format the results
   * @param {string} q Search query string
   * @param {Object} user Decoded token user object { id, role }
   */
  async searchAll(q, user) {
    if (!q || !q.trim()) {
      return [];
    }

    const query = q.trim();
    const isAdmin = user.role === 'ADMIN';

    // Fetch raw results based on roles
    const rawResults = isAdmin
      ? await searchRepository.searchAllForAdmin(query)
      : await searchRepository.searchAllForUser(query, user.id);

    const formattedResults = [];

    // 1. Format Users
    if (rawResults.users && rawResults.users.length > 0) {
      rawResults.users.forEach(u => {
        formattedResults.push({
          type: 'User',
          name: u.name,
          description: `${u.email} (${u.role})`,
          path: isAdmin ? `/admin/audit` : `/settings` // Redirect path
        });
      });
    }

    // 2. Format Brands
    if (rawResults.brands && rawResults.brands.length > 0) {
      rawResults.brands.forEach(b => {
        formattedResults.push({
          type: 'Brand',
          name: b.name,
          description: 'Brand Workplace',
          path: '/dashboard' // Switch to brand workspace
        });
      });
    }

    // 3. Format Audit Logs
    if (rawResults.logs && rawResults.logs.length > 0) {
      rawResults.logs.forEach(l => {
        const actor = l.user?.name || 'System';
        formattedResults.push({
          type: 'Audit Log',
          name: `${l.action} ${l.targetType}`,
          description: `Actor: ${actor} | Target: ${l.targetId || 'N/A'}`,
          path: isAdmin ? `/admin/audit` : `/settings`
        });
      });
    }

    return formattedResults;
  }
}

module.exports = new SearchService();
