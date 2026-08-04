/**
 * Seed SystemPermissions - Idempotent
 *
 * SystemPermission dùng `key` làm @id (primary key),
 * nên upsert bằng key để an toàn khi chạy lại.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding SystemPermissions...');
  const permissionsData = [
    { key: 'CREATE_POSTS', label: 'Tạo bài viết', description: 'Cho phép tạo bài viết mới', category: 'posts' },
    { key: 'PUBLISH_POSTS', label: 'Đăng bài viết', description: 'Cho phép đăng trực tiếp bài viết lên mạng xã hội', category: 'posts' },
    { key: 'APPROVE_POSTS', label: 'Phê duyệt bài viết', description: 'Cho phép duyệt hoặc từ chối bài viết', category: 'posts' },
    { key: 'DELETE_POSTS', label: 'Xóa bài viết', description: 'Cho phép xóa bài viết', category: 'posts' },
    { key: 'MANAGE_ROLES', label: 'Quản lý vai trò', description: 'Cho phép tạo, sửa, xóa vai trò tùy chỉnh', category: 'management' },
    { key: 'INVITE_MEMBERS', label: 'Mời thành viên', description: 'Cho phép mời thành viên mới vào thương hiệu', category: 'management' }
  ];

  for (const { key, ...data } of permissionsData) {
    await prisma.systemPermission.upsert({
      where: { key },
      update: data,
      create: { key, ...data }
    });
  }
};
