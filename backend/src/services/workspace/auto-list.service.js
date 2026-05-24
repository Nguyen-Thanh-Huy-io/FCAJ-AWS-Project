const autoListRepository = require('../../repositories/workspace/auto-list.repository');

class AutoListService {
  async getAutoLists(brandId) {
    const lists = await autoListRepository.findManyByBrand(brandId);
    return lists.map(list => ({
      ...list,
      progress: list.totalPostsCount > 0 
        ? Math.round((list.publishedPostsCount / list.totalPostsCount) * 100) 
        : 0
    }));
  }

  async getAutoListDetails(id) {
    return autoListRepository.findById(id);
  }

  async createAutoList(brandId, data) {
    return autoListRepository.create({
      ...data,
      brandId,
      sourceType: data.sourceType || 'MANUAL',
      targetPlatforms: data.targetPlatforms || 'YOUTUBE',
      scheduleType: data.scheduleType || 'INTERVAL',
      activeDays: data.activeDays || '1,2,3,4,5,6,7'
    });
  }

  async updateAutoList(id, data) {
    return autoListRepository.update(id, data);
  }

  async deleteAutoList(id) {
    return autoListRepository.delete(id);
  }

  async toggleStatus(id) {
    const list = await autoListRepository.findById(id);
    if (!list) throw new Error('AutoList not found');
    return autoListRepository.update(id, { isActive: !list.isActive });
  }
}

module.exports = new AutoListService();
