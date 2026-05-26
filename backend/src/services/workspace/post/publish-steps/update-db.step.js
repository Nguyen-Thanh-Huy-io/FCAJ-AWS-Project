const BaseStep = require('../../../../core/pipeline/base.step');
const postRepository = require('../../../../repositories/workspace/post.repository');
const { POST_STATUS } = require('../../../../utils/constants');

class UpdatePostStatusStep extends BaseStep {
  async execute(context) {
    const { post, results } = context;

    if (!results || results.length === 0) {
      return;
    }

    const allSuccessful = results.every(r => r.success);
    const firstFailure = results.find(r => !r.success);

    if (allSuccessful) {
      // Use result from first platform as primary identifier (or aggregate if needed)
      const primaryResult = results[0].result;
      await postRepository.update(post.id, {
        status: POST_STATUS.PUBLISHED,
        platformPostId: primaryResult.platformVideoId,
        publishedAt: primaryResult.publishedAt || new Date()
      });
    } else {
      await postRepository.update(post.id, {
        status: POST_STATUS.FAILED,
        failureReason: firstFailure ? `${firstFailure.platform}: ${firstFailure.error}` : 'Unknown publishing error'
      });
    }
  }
}

module.exports = UpdatePostStatusStep;
