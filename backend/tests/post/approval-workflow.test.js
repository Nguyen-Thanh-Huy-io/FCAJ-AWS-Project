const request = require('supertest');

let mockUser = { id: 'operator-id', email: 'operator@publicast.com' };

// Mock Auth Middleware
jest.mock('../../src/middlewares/auth.middleware', () => ({
  verifyAuth: (req, res, next) => {
    req.user = mockUser;
    next();
  }
}));

// Mock Authorization Facade
jest.mock('../../src/services/auth/authorization.facade', () => ({
  checkBrandAccess: jest.fn().mockResolvedValue(true),
  hasPermission: jest.fn().mockImplementation((userId, brandId, permission) => {
    if (permission === 'APPROVE_POSTS') {
      return Promise.resolve(userId === 'reviewer-id');
    }
    return Promise.resolve(false);
  })
}));

// Mock Prisma
jest.mock('../../src/config/prisma', () => {
  const mockPost = {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn()
  };
  const mockApprovalWorkflow = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };
  const mockBrand = {
    findUnique: jest.fn()
  };
  const mockTeam = {
    findMany: jest.fn()
  };

  return {
    post: mockPost,
    approvalWorkflow: mockApprovalWorkflow,
    brand: mockBrand,
    team: mockTeam
  };
});

// Mock BullMQ Queue calls
jest.mock('../../src/queues/publish.queue', () => ({
  publishQueue: { client: { on: jest.fn() } },
  upsertPublishJob: jest.fn().mockResolvedValue(true),
  removePublishJob: jest.fn().mockResolvedValue(true)
}));

// Mock Queue Dashboard
jest.mock('../../src/queues/dashboard', () => ({
  getRouter: () => (req, res, next) => next()
}));

const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const authorizationFacade = require('../../src/services/auth/authorization.facade');

describe('Post Content Approval Workflow APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { id: 'operator-id', email: 'operator@publicast.com' };
  });

  describe('POST /api/posts - Interception by lack of APPROVE_POSTS permission', () => {
    it('should intercept directly scheduling a post and create PENDING_APPROVAL status with workflow request', async () => {
      // Mock post creation data
      const postPayload = {
        title: 'New Campaign Post',
        caption: 'Save the date!',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        brandId: 'brand-123',
        reviewerIds: ['reviewer-id'],
        requesterNote: 'Hãy duyệt bài viết này cho mình nhé!'
      };

      // Mock post repository responses
      const mockPostObj = {
        id: 'post-1',
        title: 'New Campaign Post',
        caption: 'Save the date!',
        status: 'PENDING_APPROVAL',
        brandId: 'brand-123',
        createdByUserId: 'operator-id',
        scheduledAt: new Date(postPayload.scheduledAt),
        createdAt: new Date(),
        creator: { id: 'operator-id', name: 'Operator User' }
      };
      prisma.post.create.mockResolvedValue(mockPostObj);
      prisma.post.findUnique.mockResolvedValue(mockPostObj);

      prisma.approvalWorkflow.create.mockResolvedValue({
        id: 'wf-1',
        postId: 'post-1',
        brandId: 'brand-123',
        requesterId: 'operator-id',
        status: 'PENDING',
        selectedReviewers: JSON.stringify(['reviewer-id'])
      });

      const res = await request(app)
        .post('/api/posts')
        .send(postPayload)
        .expect(201);

      expect(res.body.data.status).toBe('pending_approval');
      expect(prisma.post.create).toHaveBeenCalled();
      expect(prisma.approvalWorkflow.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          postId: 'post-1',
          status: 'PENDING',
          selectedReviewers: JSON.stringify(['reviewer-id'])
        })
      }));
    });

    it('should allow directly creating a post with PENDING_APPROVAL status and create a workflow request', async () => {
      const postPayload = {
        title: 'Explicit Review Post',
        caption: 'Review me please!',
        status: 'PENDING_APPROVAL',
        brandId: 'brand-123',
        reviewerIds: ['reviewer-id'],
        requesterNote: 'Hãy duyệt bài viết này cho mình nhé!'
      };

      const mockPostObj = {
        id: 'post-2',
        title: 'Explicit Review Post',
        caption: 'Review me please!',
        status: 'PENDING_APPROVAL',
        brandId: 'brand-123',
        createdByUserId: 'operator-id',
        createdAt: new Date(),
        creator: { id: 'operator-id', name: 'Operator User' }
      };
      prisma.post.create.mockResolvedValue(mockPostObj);
      prisma.post.findUnique.mockResolvedValue(mockPostObj);

      prisma.approvalWorkflow.create.mockResolvedValue({
        id: 'wf-2',
        postId: 'post-2',
        brandId: 'brand-123',
        requesterId: 'operator-id',
        status: 'PENDING',
        selectedReviewers: JSON.stringify(['reviewer-id'])
      });

      const res = await request(app)
        .post('/api/posts')
        .send(postPayload)
        .expect(201);

      expect(res.body.data.status).toBe('pending_approval');
      expect(prisma.post.create).toHaveBeenCalled();
      expect(prisma.approvalWorkflow.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          postId: 'post-2',
          status: 'PENDING',
          selectedReviewers: JSON.stringify(['reviewer-id'])
        })
      }));
    });
  });

  describe('POST /api/brands/:brandId/workflows/:id/review', () => {
    it('should allow user with APPROVE_POSTS permission to approve request', async () => {
      mockUser = { id: 'reviewer-id', email: 'reviewer@publicast.com' };

      const mockWorkflow = {
        id: 'wf-1',
        postId: 'post-1',
        brandId: 'brand-123',
        requesterId: 'operator-id',
        status: 'PENDING',
        selectedReviewers: JSON.stringify(['reviewer-id']),
        post: {
          id: 'post-1',
          status: 'PENDING_APPROVAL',
          scheduledAt: new Date(Date.now() + 86400000)
        }
      };

      prisma.approvalWorkflow.findUnique.mockResolvedValue(mockWorkflow);
      prisma.approvalWorkflow.update.mockResolvedValue({
        ...mockWorkflow,
        status: 'APPROVED'
      });
      prisma.post.update.mockResolvedValue({
        id: 'post-1',
        status: 'SCHEDULED'
      });

      const res = await request(app)
        .post('/api/brands/brand-123/workflows/wf-1/review')
        .send({ action: 'APPROVED', comment: 'Looks great, scheduling!' })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.status).toBe('APPROVED');
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { status: 'SCHEDULED' }
      });
    });

    it('should reject review action if user lacks APPROVE_POSTS permission and is not listed as reviewer', async () => {
      mockUser = { id: 'unauthorized-id', email: 'unauth@publicast.com' };

      const mockWorkflow = {
        id: 'wf-1',
        postId: 'post-1',
        brandId: 'brand-123',
        requesterId: 'operator-id',
        status: 'PENDING',
        selectedReviewers: JSON.stringify(['reviewer-id'])
      };

      prisma.approvalWorkflow.findUnique.mockResolvedValue(mockWorkflow);

      const res = await request(app)
        .post('/api/brands/brand-123/workflows/wf-1/review')
        .send({ action: 'APPROVED', comment: 'Stealing approval power!' })
        .expect(403);

      expect(res.body.message).toContain('không có quyền phê duyệt');
    });

    it('should move post back to DRAFT when review action is REVISION_NEEDED', async () => {
      mockUser = { id: 'reviewer-id', email: 'reviewer@publicast.com' };

      const mockWorkflow = {
        id: 'wf-1',
        postId: 'post-1',
        brandId: 'brand-123',
        requesterId: 'operator-id',
        status: 'PENDING',
        selectedReviewers: JSON.stringify(['reviewer-id']),
        post: {
          id: 'post-1',
          status: 'PENDING_APPROVAL'
        }
      };

      prisma.approvalWorkflow.findUnique.mockResolvedValue(mockWorkflow);
      prisma.approvalWorkflow.update.mockResolvedValue({
        ...mockWorkflow,
        status: 'REVISION_NEEDED'
      });
      prisma.post.update.mockResolvedValue({
        id: 'post-1',
        status: 'DRAFT'
      });

      const res = await request(app)
        .post('/api/brands/brand-123/workflows/wf-1/review')
        .send({ action: 'REVISION_NEEDED', comment: 'Please fix the typo in the first line.' })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { status: 'DRAFT' }
      });
    });
  });

  describe('GET /api/brands/:brandId/workflows/reviewers', () => {
    it('should return the list of potential reviewers for the brand', async () => {
      mockUser = { id: 'operator-id', email: 'operator@publicast.com' };

      const mockBrand = {
        id: 'brand-123',
        ownerId: 'owner-id',
        owner: {
          id: 'owner-id',
          name: 'Brand Owner',
          email: 'owner@publicast.com',
          avatarUrl: null
        }
      };

      const mockMembers = [
        {
          id: 'mem-1',
          userId: 'admin-id',
          role: 'ADMIN',
          status: 'ACTIVE',
          user: {
            id: 'admin-id',
            name: 'Admin User',
            email: 'admin@publicast.com',
            avatarUrl: null
          },
          customRole: null
        },
        {
          id: 'mem-2',
          userId: 'analyst-id',
          role: 'ANALYST',
          status: 'ACTIVE',
          user: {
            id: 'analyst-id',
            name: 'Analyst User',
            email: 'analyst@publicast.com',
            avatarUrl: null
          },
          customRole: null
        }
      ];

      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.team.findMany.mockResolvedValue(mockMembers);

      const res = await request(app)
        .get('/api/brands/brand-123/workflows/reviewers')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(2); // Owner + Admin
      expect(res.body.data[0].role).toBe('OWNER');
      expect(res.body.data[1].role).toBe('ADMIN');
    });
  });
});
