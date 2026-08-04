const prisma = require('./prisma');
const logger = require('../utils/logger');

const DEFAULT_PERMISSIONS = [
  // Content & Media Permissions
  { key: "CREATE_POSTS", label: "Tạo bài đăng (Create Posts)", description: "Tạo nháp, tải lên đa phương tiện vào Media Library", category: "content" },
  { key: "APPROVE_POSTS", label: "Phê duyệt bài đăng (Approve Posts)", description: "Duyệt hoặc từ chối bài viết trong hàng đợi", category: "content" },
  { key: "MANAGE_MEDIA", label: "Quản lý hình ảnh/Media (Manage Media)", description: "Tải lên, xóa và quản lý thư viện hình ảnh/video", category: "content" },
  { key: "CREATE_LIVESTREAM", label: "Quản lý Livestream (Manage Livestream)", description: "Thiết lập, lên lịch và quản lý phát trực tiếp", category: "content" },
  
  // Management Permissions
  { key: "MANAGE_CONNECTIONS", label: "Liên kết MXH (Manage Connections)", description: "Kết nối hoặc hủy kết nối các kênh mạng xã hội", category: "management" },
  { key: "MANAGE_TEAM", label: "Quản lý thành viên (Manage Team)", description: "Mời thành viên mới, cập nhật vai trò, trục xuất", category: "management" },
  { key: "MANAGE_ROLES", label: "Quản lý vai trò (Manage Roles)", description: "Tạo, sửa và xóa vai trò tùy chỉnh", category: "management" },
  { key: "VIEW_ANALYTICS", label: "Xem báo cáo (View Analytics)", description: "Xem báo cáo, phân tích tương tác thương hiệu", category: "management" }
];

async function seedSystemPermissions() {
  try {
    const count = await prisma.systemPermission.count();
    if (count === 0) {
      logger.info('Seeding default system permissions...');
      await prisma.systemPermission.createMany({
        data: DEFAULT_PERMISSIONS
      });
      logger.info('System permissions seeded successfully!');
    }
  } catch (error) {
    logger.error('Failed to seed system permissions', error);
  }
}

module.exports = { seedSystemPermissions };
