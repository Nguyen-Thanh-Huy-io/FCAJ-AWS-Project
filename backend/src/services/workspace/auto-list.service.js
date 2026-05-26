const autoListRepository = require('../../repositories/workspace/auto-list.repository');
const postRepository = require('../../repositories/workspace/post.repository');
const { ScheduleStrategyFactory } = require('../../utils/scheduler-strategies');
const { eventEmitter, EVENTS } = require('../../events/event-emitter');
const { AUTOLIST_TYPES, POST_STATUS } = require('../../utils/constants');

class AutoListService {
  async getAutoLists(brandId) {
    const lists = await autoListRepository.findManyByBrand(brandId);
    return lists.map(list => this._formatAutoListResponse(list));
  }

  async getAutoListDetails(id) {
    return autoListRepository.findById(id);
  }

  async createAutoList(brandId, data) {
    const preparedData = this._prepareAutoListData(data, brandId);
    const created = await autoListRepository.create(preparedData);
    
    eventEmitter.emit(EVENTS.AUTOLIST.CREATED, { autoListId: created.id });
    return this.getAutoListDetails(created.id);
  }

  async updateAutoList(id, data) {
    const preparedData = this._prepareAutoListData(data);
    await autoListRepository.update(id, preparedData);

    eventEmitter.emit(EVENTS.AUTOLIST.UPDATED, { autoListId: id });
    return this.getAutoListDetails(id);
  }

  async deleteAutoList(id) {
    return autoListRepository.delete(id);
  }

  async toggleStatus(id) {
    const list = await autoListRepository.findById(id);
    if (!list) throw new Error('AutoList not found');
    
    await autoListRepository.update(id, { isActive: !list.isActive });
    eventEmitter.emit(EVENTS.AUTOLIST.TOGGLED, { autoListId: id });
    
    return this.getAutoListDetails(id);
  }

  /**
   * Recalculate scheduledAt dates for all unpublished posts in the autolist
   */
  async recalculateQueueSchedules(autoListId) {
    const autoList = await autoListRepository.findById(autoListId);
    if (!autoList) return;

    await this._updateAutoListStats(autoList);
    
    const unpublishedPosts = (autoList.posts || []).filter(p => p.status !== POST_STATUS.PUBLISHED && p.status !== POST_STATUS.FAILED);
    if (unpublishedPosts.length === 0) return;

    await this._updatePostSchedules(autoList, unpublishedPosts);
  }

  // ============= Private Helper Methods =============

  _formatAutoListResponse(list) {
    return {
      ...list,
      progress: list.totalPostsCount > 0 
        ? Math.round((list.publishedPostsCount / list.totalPostsCount) * 100) 
        : 0
    };
  }

  _prepareAutoListData(data, brandId) {
    const prepared = {
      name: data.name,
      brandId,
      sourceType: data.sourceType || AUTOLIST_TYPES.SOURCE.MANUAL,
      targetPlatforms: data.targetPlatforms,
      scheduleType: data.scheduleType || AUTOLIST_TYPES.SCHEDULE.INTERVAL,
      intervalMinutes: data.intervalMinutes ? parseInt(data.intervalMinutes) : undefined,
      specificTimes: data.specificTimes,
      activeDays: data.activeDays,
      loopEnabled: data.loopEnabled !== undefined ? (data.loopEnabled === true || data.loopEnabled === 'true') : undefined,
      isActive: data.isActive !== undefined ? (data.isActive === true || data.isActive === 'true') : undefined
    };

    // Clean up undefined keys for updates
    Object.keys(prepared).forEach(key => prepared[key] === undefined && delete prepared[key]);
    return prepared;
  }

  async _updateAutoListStats(autoList) {
    const allPosts = autoList.posts || [];
    await autoListRepository.updateStats(autoList.id, {
        totalPostsCount: allPosts.length,
        publishedPostsCount: allPosts.filter(p => p.status === POST_STATUS.PUBLISHED).length
    });
  }

  async _updatePostSchedules(autoList, unpublishedPosts) {
    const strategy = ScheduleStrategyFactory.getStrategy(autoList.scheduleType);
    const slots = strategy.calculateNextSlots(autoList, unpublishedPosts.length, new Date());

    const postIds = unpublishedPosts.map(p => p.id);
    // Note: Prisma updateMany doesn't support setting different values per ID easily in one call
    // but for schedules they are different. We must loop or use a more complex raw query.
    // For now, we keep individual updates but use the repository.
    for (let i = 0; i < unpublishedPosts.length; i++) {
      await postRepository.update(unpublishedPosts[i].id, {
          scheduledAt: slots[i] || new Date(),
          status: autoList.isActive ? POST_STATUS.SCHEDULED : POST_STATUS.DRAFT
      });
    }
  }
}

module.exports = new AutoListService();
