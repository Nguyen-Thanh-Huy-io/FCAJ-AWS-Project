/**
 * Review Action Strategies — Strategy Pattern
 *
 * Mỗi hành động phê duyệt (APPROVED / REJECTED / REVISION_NEEDED) là một Strategy
 * độc lập, implement interface { execute(workflow) }.
 *
 * Để thêm hành động mới:
 *   1. Tạo class XxxActionStrategy bên dưới.
 *   2. Thêm key tương ứng vào REVIEW_ACTION trong constants.js.
 *   3. Đăng ký vào REVIEW_ACTION_STRATEGY_MAP — KHÔNG cần sửa service.
 *
 * Tuân thủ: OCP (Open for extension, Closed for modification).
 */

const { WORKFLOW_STATUS, REVIEW_ACTION, POST_STATUS } = require('../../utils/constants');
const { upsertPublishJob } = require('../../queues/publish.queue');

// ---------------------------------------------------------------------------
// Strategy implementations
// ---------------------------------------------------------------------------

/**
 * APPROVED — Nếu bài có lịch đăng → SCHEDULED + đăng ký BullMQ job.
 *            Nếu không            → APPROVED ngay.
 */
class ApprovedActionStrategy {
  async execute(workflow) {
    const hasSchedule = workflow.post && workflow.post.scheduledAt;
    if (hasSchedule) {
      await upsertPublishJob(workflow.post.id, workflow.post.scheduledAt);
      return {
        workflowStatus: WORKFLOW_STATUS.APPROVED,
        postStatus:     POST_STATUS.SCHEDULED
      };
    }
    return {
      workflowStatus: WORKFLOW_STATUS.APPROVED,
      postStatus:     POST_STATUS.APPROVED
    };
  }
}

/**
 * REJECTED — Từ chối bài viết.
 */
class RejectedActionStrategy {
  async execute(_workflow) {
    return {
      workflowStatus: WORKFLOW_STATUS.REJECTED,
      postStatus:     POST_STATUS.REJECTED
    };
  }
}

/**
 * REVISION_NEEDED — Yêu cầu chỉnh sửa, đưa bài về DRAFT.
 */
class RevisionNeededActionStrategy {
  async execute(_workflow) {
    return {
      workflowStatus: WORKFLOW_STATUS.REVISION_NEEDED,
      postStatus:     POST_STATUS.DRAFT
    };
  }
}

// ---------------------------------------------------------------------------
// Registry — map action → strategy instance
// ---------------------------------------------------------------------------

const REVIEW_ACTION_STRATEGY_MAP = {
  [REVIEW_ACTION.APPROVED]:        new ApprovedActionStrategy(),
  [REVIEW_ACTION.REJECTED]:        new RejectedActionStrategy(),
  [REVIEW_ACTION.REVISION_NEEDED]: new RevisionNeededActionStrategy()
};

module.exports = { REVIEW_ACTION_STRATEGY_MAP };
