const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'test_selenium_user@example.com';
  const password = 'Password123!';
  
  console.log(`Đang kiểm tra tài khoản test: ${email}...`);
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log("Tài khoản test đã tồn tại. Đang cập nhật mật khẩu...");
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        isActive: true,
        isEmailVerified: true
      }
    });
    console.log("Cập nhật tài khoản test thành công!");
    return;
  }

  console.log("Đang tạo mới tài khoản test...");
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: 'Selenium Tester',
      role: 'USER',
      isActive: true,
      isEmailVerified: true,
      settings: {
        create: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh'
        }
      },
      accounts: {
        create: [
          {
            provider: 'LOCAL',
            passwordHash
          }
        ]
      }
    }
  });
  console.log("Tạo tài khoản test thành công!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
