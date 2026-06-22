const BaseStep = require('../../../../core/pipeline/base.step');
const postRepository = require('../../../../repositories/workspace/post.repository');
const autoListRepository = require('../../../../repositories/workspace/auto-list.repository');
const { POST_STATUS } = require('../../../../utils/constants');

class UpdatePostStatusStep extends BaseStep {
  async execute(context) {
    const { post, results } = context;

    if (!results || results.length === 0) {
      return;
    }

    const allSuccessful = results.every(r => r.success);
    const firstFailure = results.find(r => !r.success);

    // Logic: Handle AutoList Loop (Repeat) mode
    let shouldLoop = false;
    if (post.autoListId) {
      const autoList = await autoListRepository.findById(post.autoListId);
      if (autoList && autoList.loopEnabled) {
        shouldLoop = true;
      }
    }

    if (allSuccessful) {
      const primaryResult = results[0].result;

      if (shouldLoop) {
        await this._handleLoopCycle(post, {
          status: POST_STATUS.PUBLISHED,
          publishedAt: primaryResult.publishedAt || new Date(),
          platformPostId: primaryResult.platformVideoId
        });
      } else {
        // Standard non-loop behavior: mark the post itself as published
        await postRepository.update(post.id, {
          status: POST_STATUS.PUBLISHED,
          platformPostId: primaryResult.platformVideoId,
          publishedAt: primaryResult.publishedAt || new Date()
        });
      }
    } else {
      // Handle Failure
      const failureReason = firstFailure ? `${firstFailure.platform}: ${firstFailure.error}` : 'Unknown publishing error';
      if (shouldLoop) {
        await this._handleLoopCycle(post, {
          status: POST_STATUS.FAILED,
          failureReason
        });
      } else {
        await postRepository.update(post.id, {
          status: POST_STATUS.FAILED,
          failureReason
        });
      }
    }

    // Post-Publish: Trigger stats update and rescheduling for AutoLists
    if (post.autoListId) {
      const autoListService = require('../../auto-list.service');
      await autoListService.updateLastPostedAt(post.autoListId, new Date());
      await autoListService.recalculateQueueSchedules(post.autoListId);
    }
  }

  /**
   * Performs the loop cycle:
   * 1. Creates a published or failed clone of the post for history/analytics (with autoListId = null).
   * 2. Resets the original post to the end of the queue.
   */
  async _handleLoopCycle(post, cycleData) {
    try {
      // 1. Snapshot the publication result into a new static record (history)
      await postRepository.create({
        brandId: post.brandId,
        createdByUserId: post.createdByUserId,
        title: post.title,
        caption: post.caption,
        type: post.type,
        status: cycleData.status,
        targetPlatforms: post.targetPlatforms,
        mediaUrls: post.mediaUrls,
        mediaThumbnailUrls: post.mediaThumbnailUrls,
        hashtags: post.hashtags,
        mentions: post.mentions,
        firstComment: post.firstComment,
        locationId: post.locationId,
        locationName: post.locationName,
        linkUrl: post.linkUrl,
        altText: post.altText,
        metadata: post.metadata,
        isCollaboration: post.isCollaboration,
        collaboratorHandle: post.collaboratorHandle,
        publishedAt: cycleData.publishedAt || null,
        platformPostId: cycleData.platformPostId || null,
        failureReason: cycleData.failureReason || null,
        isLibrary: false
        // autoListId is NULL for the history snapshot so it doesn't appear in the queue
      });

      // 2. Recycle the original post record to the end of the queue
      await postRepository.update(post.id, {
        createdAt: new Date(), // Move to end
        status: POST_STATUS.DRAFT, // autoListService will set to SCHEDULED if list is active
        platformPostId: null,
        publishedAt: null,
        failureReason: null
      });
    } catch (err) {
      console.error('[UpdatePostStatusStep] Loop cycle failure:', err.message);
    }
  }
}

module.exports = UpdatePostStatusStep;
