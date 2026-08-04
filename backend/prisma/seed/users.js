/**
 * Seed Users - Idempotent
 *
 * User có email @unique, nên upsert bằng email.
 * Đối với nested create (settings, accounts) dùng connectOrCreate
 * hoặc kiểm tra tồn tại trước khi tạo.
 *
 * Lưu ý: UserAccount có @@unique([userId, provider]),
 * UserSettings có userId @unique → dùng upsert nested.
 */
const bcrypt = require('bcryptjs');

module.exports = async function (prisma, context) {
  console.log('Seeding Users...');
  const customerPasswordHash = bcrypt.hashSync('nhacc123@', 10);
  const testUserPasswordHash = bcrypt.hashSync('123456aA@', 10);

  // Helper: upsert user + settings + account
  async function upsertUser({ id, email, passwordHash, name, role, hasAccount = true }) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, role, isActive: true, isEmailVerified: true },
      create: {
        ...(id ? { id } : {}),
        email, passwordHash, name, role,
        isActive: true, isEmailVerified: true
      }
    });

    // Upsert settings (userId is @unique)
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' },
      create: { userId: user.id, language: 'vi', timezone: 'Asia/Ho_Chi_Minh' }
    });

    // Upsert account (@@unique([userId, provider]))
    if (hasAccount) {
      await prisma.userAccount.upsert({
        where: { userId_provider: { userId: user.id, provider: 'LOCAL' } },
        update: { passwordHash },
        create: { userId: user.id, provider: 'LOCAL', passwordHash }
      });
    }

    return user;
  }

  const customerUser = await upsertUser({
    email: 'vothanhnha26@gmail.com', passwordHash: customerPasswordHash,
    name: 'Võ Thành Nhã', role: 'OWNER'
  });

  const adminUser = await upsertUser({
    email: 'admin@publicast.com', passwordHash: customerPasswordHash,
    name: 'Hệ Thống Admin', role: 'ADMIN'
  });

  const staffUser = await upsertUser({
    email: 'staff@publicast.com', passwordHash: customerPasswordHash,
    name: 'Nhân Viên Hỗ Trợ', role: 'STAFF'
  });

  const testUser = await upsertUser({
    id: 'e673a8b3-5edf-4366-b1e1-4400c06eb5dd',
    email: 'trongphuc91thcsduclap@gmail.com', passwordHash: testUserPasswordHash,
    name: 'Nguyễn Trọng Phúc', role: 'OWNER'
  });

  const specialistUser = await upsertUser({
    email: 'specialist@publicast.com', passwordHash: customerPasswordHash,
    name: 'Nguyễn Văn Chuyên (Specialist)', role: 'USER', hasAccount: false
  });

  const managerUser = await upsertUser({
    email: 'manager@publicast.com', passwordHash: customerPasswordHash,
    name: 'Lê Thị Quản Lý (Manager)', role: 'MANAGER', hasAccount: false
  });

  context.users = { customerUser, adminUser, staffUser, testUser, specialistUser, managerUser };
};
