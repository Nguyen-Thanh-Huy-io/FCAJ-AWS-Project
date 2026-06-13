const request = require('supertest');
const app = require('../src/app');

// Mock Auth Middleware
jest.mock('../src/middlewares/auth.middleware', () => ({
  verifyAuth: (req, res, next) => {
    req.user = { id: 'admin-user-id', email: 'admin@publicast.com' };
    next();
  }
}));

// Mock Prisma
jest.mock('../src/config/prisma', () => {
  const mockSystemPermission = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn()
  };
  const mockCustomRolePermission = {
    deleteMany: jest.fn()
  };

  return {
    systemPermission: mockSystemPermission,
    customRolePermission: mockCustomRolePermission
  };
});

const prisma = require('../src/config/prisma');

describe('System Permissions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/permissions', () => {
    it('should return all system permissions', async () => {
      const mockPermissions = [
        { key: 'CREATE_POSTS', label: 'Tạo bài đăng', category: 'content' },
        { key: 'VIEW_ANALYTICS', label: 'Xem báo cáo', category: 'management' }
      ];

      prisma.systemPermission.findMany.mockResolvedValue(mockPermissions);

      const res = await request(app)
        .get('/api/permissions')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockPermissions);
      expect(prisma.systemPermission.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/permissions', () => {
    it('should create a new permission successfully', async () => {
      const newPerm = {
        key: 'NEW_COOL_ACTION',
        label: 'Action cực ngầu',
        description: 'Mô tả chi tiết',
        category: 'content'
      };

      prisma.systemPermission.findUnique.mockResolvedValue(null);
      prisma.systemPermission.create.mockResolvedValue({
        ...newPerm,
        createdAt: new Date()
      });

      const res = await request(app)
        .post('/api/permissions')
        .send(newPerm)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data.key).toBe('NEW_COOL_ACTION');
      expect(prisma.systemPermission.create).toHaveBeenCalledWith({
        data: {
          key: 'NEW_COOL_ACTION',
          label: 'Action cực ngầu',
          description: 'Mô tả chi tiết',
          category: 'content'
        }
      });
    });

    it('should return 400 if permission key already exists', async () => {
      prisma.systemPermission.findUnique.mockResolvedValue({ key: 'CREATE_POSTS' });

      const res = await request(app)
        .post('/api/permissions')
        .send({ key: 'CREATE_POSTS', label: 'Duplicate key' })
        .expect(400);

      expect(res.body.message).toContain('đã tồn tại');
    });
  });

  describe('DELETE /api/permissions/:key', () => {
    it('should delete permission and cleanup role assignments', async () => {
      prisma.systemPermission.findUnique.mockResolvedValue({ key: 'CREATE_POSTS' });

      const res = await request(app)
        .delete('/api/permissions/CREATE_POSTS')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(prisma.customRolePermission.deleteMany).toHaveBeenCalledWith({
        where: { permissionKey: 'CREATE_POSTS' }
      });
      expect(prisma.systemPermission.delete).toHaveBeenCalledWith({
        where: { key: 'CREATE_POSTS' }
      });
    });

    it('should return 404 if permission does not exist', async () => {
      prisma.systemPermission.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/permissions/NON_EXISTENT')
        .expect(404);

      expect(res.body.message).toContain('Không tìm thấy');
    });
  });
});
