const { eventEmitter, EVENTS } = require('../event-emitter');
const postService = require('../../services/workspace/post.service');
const autoListService = require('../../services/workspace/auto-list.service');
const { POST_STATUS } = require('../../utils/constants');

/**
 * Initialize Post Event Subscribers
 */
const initPostSubscribers = () => {
  // Handle Auto-publishing
  eventEmitter.on(EVENTS.POST.CREATED, async ({ post, options }) => {
    if (post.status === POST_STATUS.PUBLISHED) {
      try {
        console.log(`[Event] Auto-publishing post ${post.id}`);
        await postService.publishToPlatforms(post.id, options);
      } catch (err) {
        console.error(`[Event Error] Auto-publishing failed for post ${post.id}:`, err.message);
      }
    } else if (post.status === POST_STATUS.SCHEDULED) {
      try {
        console.log(`[Event] Checking YouTube Native Scheduling for post ${post.id}`);
        await postService._handleYouTubeNativeScheduling(post, options);
      } catch (err) {
        console.error(`[Event Error] YouTube Native Scheduling failed for post ${post.id}:`, err.message);
      }
    }
  });

  eventEmitter.on(EVENTS.POST.UPDATED, async ({ post, options, statusChangedToPublished }) => {
    if (statusChangedToPublished) {
      try {
        console.log(`[Event] Publishing updated post ${post.id}`);
        await postService.publishToPlatforms(post.id, options);
      } catch (err) {
        console.error(`[Event Error] Publishing failed for updated post ${post.id}:`, err.message);
      }
    } else if (post.status === POST_STATUS.SCHEDULED) {
      try {
        console.log(`[Event] Checking YouTube Native Scheduling for updated post ${post.id}`);
        await postService._handleYouTubeNativeScheduling(post, options);
      } catch (err) {
        console.error(`[Event Error] YouTube Native Scheduling failed for updated post ${post.id}:`, err.message);
      }
    }
  });

  // Handle AutoList recalculation
  const handleAutoListUpdate = async ({ post, autoListId }) => {
    const targetId = autoListId || post?.autoListId;
    if (targetId) {
      try {
        console.log(`[Event] Recalculating AutoList ${targetId}`);
        await autoListService.recalculateQueueSchedules(targetId);
      } catch (err) {
        console.error(`[Event Error] AutoList recalculation failed for ${targetId}:`, err.message);
      }
    }
  };

  eventEmitter.on(EVENTS.POST.CREATED, handleAutoListUpdate);
  eventEmitter.on(EVENTS.POST.UPDATED, handleAutoListUpdate);
  eventEmitter.on(EVENTS.POST.DELETED, handleAutoListUpdate);
  eventEmitter.on(EVENTS.POST.RESTORED, handleAutoListUpdate);

  eventEmitter.on(EVENTS.POST.BULK_DELETED, async ({ autolistIds }) => {
    for (const id of autolistIds) {
      await handleAutoListUpdate({ autoListId: id });
    }
  });

  eventEmitter.on(EVENTS.POST.BULK_RESTORED, async ({ autolistIds }) => {
    for (const id of autolistIds) {
      await handleAutoListUpdate({ autoListId: id });
    }
  });
};

module.exports = initPostSubscribers;
