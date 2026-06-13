const approvalWorkflowRepository = require('../../repositories/workspace/approval-workflow.repository');
const postRepository = require('../../repositories/workspace/post.repository');
const authorizationFacade = require('../auth/authorization.facade');
const { POST_STATUS } = require('../../utils/constants');
const { upsertPublishJob } = require('../../queues/publish.queue');
const prisma = require('../../config/prisma');

class ApprovalWorkflowService {
  async getPotentialReviewers(brandId, userId) {
    const isMember = await authorizationFacade.checkBrandAccess(userId, brandId);
    if (!isMember) {
      const error = new Error('Bạn không có quyền truy cập vào thương hiệu này.');
      error.status = 403;
      throw error;
    }

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        }
      }
    });
    if (!brand) return [];

    const members = await prisma.team.findMany({
      where: { brandId, status: 'ACTIVE' },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        },
        customRole: {
          include: {
            permissions: true
          }
        }
      }
    });

    const reviewers = [];
    if (brand.owner) {
      reviewers.push({
        id: brand.owner.id,
        name: brand.owner.name,
        email: brand.owner.email,
        avatarUrl: brand.owner.avatarUrl,
        role: 'OWNER'
      });
    }

    for (const m of members) {
      if (m.userId === brand.ownerId) continue;

      let hasPermission = false;
      if (m.role === 'ADMIN') {
        hasPermission = true;
      } else if (m.customRole && m.customRole.permissions) {
        hasPermission = m.customRole.permissions.some(p => p.permissionKey === 'APPROVE_POSTS' && p.isAllowed);
      }

      if (hasPermission && m.user) {
        reviewers.push({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          avatarUrl: m.user.avatarUrl,
          role: m.customRole ? m.customRole.name : 'ADMIN'
        });
      }
    }

    return reviewers;
  }
  async getWorkflowsByBrand(brandId, userId) {
    if (brandId === 'all') {
      // Find all brands the user has access to (as owner or active member)
      const ownedBrands = await prisma.brand.findMany({
        where: { ownerId: userId, deletedAt: null },
        select: { id: true }
      });
      const memberBrands = await prisma.team.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { brandId: true }
      });
      
      const brandIds = [...new Set([
        ...ownedBrands.map(b => b.id),
        ...memberBrands.map(t => t.brandId)
      ])];
      
      if (brandIds.length === 0) return [];
      
      return approvalWorkflowRepository.findManyByBrand(brandIds);
    }

    // Check if the user belongs to the brand
    const isMember = await authorizationFacade.checkBrandAccess(userId, brandId);
    if (!isMember) {
      const error = new Error('Bạn không có quyền truy cập vào thương hiệu này.');
      error.status = 403;
      throw error;
    }

    return approvalWorkflowRepository.findManyByBrand(brandId);
  }

  async createWorkflowRequest(postId, requesterId, brandId, reviewerIds = [], policy = 'AT_LEAST_ONE', requesterNote = '') {
    const post = await postRepository.findById(postId);
    if (!post || post.brandId !== brandId) {
      const error = new Error('Không tìm thấy bài viết hoặc bài viết không thuộc thương hiệu này.');
      error.status = 404;
      throw error;
    }

    if (post.status !== POST_STATUS.DRAFT && post.status !== POST_STATUS.REJECTED && post.status !== 'PENDING_APPROVAL') {
      const error = new Error('Chỉ có thể gửi duyệt bài viết đang ở trạng thái Nháp, Chờ duyệt hoặc Bị từ chối.');
      error.status = 400;
      throw error;
    }

    // Verify reviewers are valid (or just save the list)
    const reviewerList = Array.isArray(reviewerIds) ? reviewerIds : [reviewerIds].filter(Boolean);

    // Create the workflow request
    const workflow = await approvalWorkflowRepository.create({
      postId,
      brandId,
      requesterId,
      approvalPolicy: policy,
      selectedReviewers: JSON.stringify(reviewerList),
      requesterNote,
      status: 'PENDING'
    });

    // Update Post status to PENDING_APPROVAL
    await postRepository.updateStatus(postId, 'PENDING_APPROVAL');

    return workflow;
  }

  async reviewWorkflowRequest(workflowId, reviewerId, action, comment = '') {
    const workflow = await approvalWorkflowRepository.findById(workflowId);
    if (!workflow) {
      const error = new Error('Không tìm thấy yêu cầu phê duyệt.');
      error.status = 404;
      throw error;
    }

    if (workflow.status !== 'PENDING') {
      const error = new Error('Yêu cầu phê duyệt này đã được xử lý trước đó.');
      error.status = 400;
      throw error;
    }

    // Authorization: User must be listed in selectedReviewers, OR have APPROVE_POSTS permission in the brand
    const reviewers = JSON.parse(workflow.selectedReviewers || '[]');
    const isListedReviewer = reviewers.includes(reviewerId);
    const hasApprovePermission = await authorizationFacade.hasPermission(reviewerId, workflow.brandId, 'APPROVE_POSTS');

    if (!isListedReviewer && !hasApprovePermission) {
      const error = new Error('Bạn không có quyền phê duyệt yêu cầu này.');
      error.status = 403;
      throw error;
    }

    let nextWorkflowStatus = 'PENDING';
    let nextPostStatus = POST_STATUS.PENDING_APPROVAL;

    if (action === 'APPROVED') {
      nextWorkflowStatus = 'APPROVED';
      // If the post has a scheduled time, set it to SCHEDULED, otherwise APPROVED
      if (workflow.post && workflow.post.scheduledAt) {
        nextPostStatus = POST_STATUS.SCHEDULED;
        // Register in BullMQ
        await upsertPublishJob(workflow.post.id, workflow.post.scheduledAt);
      } else {
        nextPostStatus = POST_STATUS.APPROVED;
      }
    } else if (action === 'REJECTED') {
      nextWorkflowStatus = 'REJECTED';
      nextPostStatus = POST_STATUS.REJECTED;
    } else if (action === 'REVISION_NEEDED') {
      nextWorkflowStatus = 'REVISION_NEEDED';
      nextPostStatus = POST_STATUS.DRAFT;
    } else {
      const error = new Error('Hành động phê duyệt không hợp lệ.');
      error.status = 400;
      throw error;
    }

    // Update workflow request
    const updatedWorkflow = await approvalWorkflowRepository.update(workflowId, {
      status: nextWorkflowStatus,
      reviewedByUserId: reviewerId,
      reviewedAt: new Date(),
      reviewerComment: comment
    });

    // Update Post status
    await postRepository.updateStatus(workflow.postId, nextPostStatus);

    return updatedWorkflow;
  }
}

module.exports = new ApprovalWorkflowService();
