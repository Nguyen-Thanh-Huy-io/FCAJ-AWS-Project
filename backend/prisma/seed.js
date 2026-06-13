const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies to avoid foreign key violations
  await prisma.auditLog.deleteMany({});
  await prisma.customRolePermission.deleteMany({});
  await prisma.customRole.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.userSettings.deleteMany({});
  await prisma.userAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.planLimit.deleteMany({});
  await prisma.systemPermission.deleteMany({});

  console.log('Seeding PlanLimits...');
  const proLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 5,
      maxSocialProfiles: 10,
      maxPostsPerMonth: 100,
      maxLivePlatforms: 3,
      maxStreamQuality: 'HD_720P',
      maxTeamSeats: 5,
      allowCustomRoles: true,
      allowApprovalWorkflow: true
    }
  });

  const freeLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 1,
      maxSocialProfiles: 2,
      maxPostsPerMonth: 10,
      maxLivePlatforms: 1,
      maxStreamQuality: 'SD',
      maxTeamSeats: 1,
      allowCustomRoles: false,
      allowApprovalWorkflow: false
    }
  });

  console.log('Seeding Plans...');
  const proPlan = await prisma.plan.create({
    data: {
      name: 'PRO',
      priceAmount: 29.00,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      description: 'Professional Plan',
      planLimitId: proLimit.id,
      isActive: true
    }
  });

  const freePlan = await prisma.plan.create({
    data: {
      name: 'FREE',
      priceAmount: 0,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      description: 'Free Plan',
      planLimitId: freeLimit.id,
      isActive: true
    }
  });

  console.log('Seeding SystemPermissions...');
  const permissionsData = [
    { key: 'CREATE_POSTS', label: 'Tạo bài viết', description: 'Cho phép tạo bài viết mới', category: 'posts' },
    { key: 'PUBLISH_POSTS', label: 'Đăng bài viết', description: 'Cho phép đăng trực tiếp bài viết lên mạng xã hội', category: 'posts' },
    { key: 'APPROVE_POSTS', label: 'Phê duyệt bài viết', description: 'Cho phép duyệt hoặc từ chối bài viết', category: 'posts' },
    { key: 'DELETE_POSTS', label: 'Xóa bài viết', description: 'Cho phép xóa bài viết', category: 'posts' },
    { key: 'MANAGE_ROLES', label: 'Quản lý vai trò', description: 'Cho phép tạo, sửa, xóa vai trò tùy chỉnh', category: 'management' },
    { key: 'INVITE_MEMBERS', label: 'Mời thành viên', description: 'Cho phép mời thành viên mới vào thương hiệu', category: 'management' }
  ];

  for (const perm of permissionsData) {
    await prisma.systemPermission.create({
      data: perm
    });
  }

  console.log('Seeding User...');
  // Password is 'admin123'
  const passwordHash = '$2a$10$tMhPqW9gZ72bM7d/vXlU7eS0mD1zZl/z/n6J3c9i7o9B01G5C5.P.';
  const user = await prisma.user.create({
    data: {
      email: 'vothanhnha26@gmail.com',
      passwordHash: passwordHash,
      name: 'Nhã Võ',
      role: 'ADMIN',
      isActive: true,
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
            passwordHash: passwordHash
          },
          {
            provider: 'GOOGLE',
            providerId: 'google-oauth2-vothanhnha26'
          }
        ]
      }
    }
  });

  // Additional members to populate Team Management page
  const memberSpecialist = await prisma.user.create({
    data: {
      email: 'specialist@publicast.com',
      passwordHash: passwordHash,
      name: 'Nguyễn Văn Chuyên',
      role: 'USER',
      isActive: true,
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
            passwordHash: passwordHash
          },
          {
            provider: 'GOOGLE',
            providerId: 'google-oauth2-chuyennguyen'
          }
        ]
      }
    }
  });

  const memberManager = await prisma.user.create({
    data: {
      email: 'manager@publicast.com',
      passwordHash: passwordHash,
      name: 'Lê Thị Quản Lý',
      role: 'MANAGER',
      isActive: true,
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
            passwordHash: passwordHash
          }
        ]
      }
    }
  });

  const memberGuest = await prisma.user.create({
    data: {
      email: 'guest@publicast.com',
      passwordHash: passwordHash,
      name: 'Trần Khách Mời',
      role: 'USER',
      isActive: true,
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
            passwordHash: passwordHash
          }
        ]
      }
    }
  });

  console.log('Seeding Subscription...');
  const subscription = await prisma.subscription.create({
    data: {
      planId: proPlan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Seeding Brand...');
  const brand = await prisma.brand.create({
    data: {
      name: 'PubliCast Team',
      timezone: 'Asia/Ho_Chi_Minh',
      defaultLanguage: 'vi',
      ownerId: user.id,
      subscriptionId: subscription.id,
      isActive: true
    }
  });

  console.log('Seeding Custom Roles...');
  
  // 1. Social Specialist Role
  const specialistRole = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Social Media Specialist',
      description: 'Chuyên viên biên soạn và tối ưu bài viết mạng xã hội',
      colorHex: '#3B82F6',
      permissions: {
        create: [
          { permissionKey: 'CREATE_POSTS', isAllowed: true },
          { permissionKey: 'PUBLISH_POSTS', isAllowed: false },
          { permissionKey: 'APPROVE_POSTS', isAllowed: false },
          { permissionKey: 'DELETE_POSTS', isAllowed: true },
          { permissionKey: 'MANAGE_ROLES', isAllowed: false },
          { permissionKey: 'INVITE_MEMBERS', isAllowed: false }
        ]
      }
    }
  });

  // 2. Content Manager Role
  const managerRole = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Content Manager',
      description: 'Quản lý duyệt bài viết và cấu hình quyền hạn cơ bản',
      colorHex: '#8B5CF6',
      permissions: {
        create: [
          { permissionKey: 'CREATE_POSTS', isAllowed: true },
          { permissionKey: 'PUBLISH_POSTS', isAllowed: true },
          { permissionKey: 'APPROVE_POSTS', isAllowed: true },
          { permissionKey: 'DELETE_POSTS', isAllowed: true },
          { permissionKey: 'MANAGE_ROLES', isAllowed: true },
          { permissionKey: 'INVITE_MEMBERS', isAllowed: true }
        ]
      }
    }
  });

  // 3. Guest Editor Role
  const guestRole = await prisma.customRole.create({
    data: {
      brandId: brand.id,
      name: 'Guest Editor',
      description: 'Thành viên viết bài khách mời, chỉ soạn thảo bản nháp',
      colorHex: '#F59E0B',
      permissions: {
        create: [
          { permissionKey: 'CREATE_POSTS', isAllowed: true },
          { permissionKey: 'PUBLISH_POSTS', isAllowed: false },
          { permissionKey: 'APPROVE_POSTS', isAllowed: false },
          { permissionKey: 'DELETE_POSTS', isAllowed: false },
          { permissionKey: 'MANAGE_ROLES', isAllowed: false },
          { permissionKey: 'INVITE_MEMBERS', isAllowed: false }
        ]
      }
    }
  });

  console.log('Seeding Team Members...');
  
  // Owner is Nhã Võ
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: user.id,
      role: 'OWNER',
      invitedByUserId: user.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  // Specialist Nguyễn Văn Chuyên
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: memberSpecialist.id,
      role: 'USER',
      customRoleId: specialistRole.id,
      invitedByUserId: user.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  // Manager Lê Thị Quản Lý
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: memberManager.id,
      role: 'MANAGER',
      customRoleId: managerRole.id,
      invitedByUserId: user.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  // Guest Trần Khách Mời
  await prisma.team.create({
    data: {
      brandId: brand.id,
      userId: memberGuest.id,
      role: 'USER',
      customRoleId: guestRole.id,
      invitedByUserId: user.id,
      status: 'ACTIVE',
      acceptedAt: new Date()
    }
  });

  console.log('Seeding AuditLogs...');
  const auditLogs = [
    {
      action: 'PUBLISHED',
      targetType: 'Content',
      targetId: 'Q2 Campaign Post',
      details: 'success',
      ipAddress: '192.168.1.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 mins ago
    },
    {
      action: 'INVITED',
      targetType: 'Team',
      targetId: 'alex@company.com',
      details: 'success',
      ipAddress: '10.0.0.15',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 mins ago
    },
    {
      action: 'FAILED LOGIN',
      targetType: 'Security',
      targetId: 'admin@publicast.com',
      details: 'failed',
      ipAddress: '45.33.21.108',
      userAgent: 'python-requests/2.28.1',
      createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
    },
    {
      action: 'SUBMITTED',
      targetType: 'Content',
      targetId: 'Product Launch Stream',
      details: 'success',
      ipAddress: '192.168.1.88',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 mins ago
    },
    {
      action: 'PLAN UPGRADE',
      targetType: 'Billing',
      targetId: 'Pro → Agency',
      details: 'success',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      action: 'EDITED',
      targetType: 'Content',
      targetId: 'Summer Campaign',
      details: 'success',
      ipAddress: '192.168.1.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      action: 'EXPORTED',
      targetType: 'Data',
      targetId: 'Analytics Report Q1',
      details: 'success',
      ipAddress: '10.0.0.15',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      action: 'START STREAM',
      targetType: 'Stream',
      targetId: 'Tech Review Q2',
      details: 'success',
      ipAddress: '192.168.1.88',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
      action: 'PASSWORD CHANGE',
      targetType: 'Security',
      targetId: 'admin@publicast.com',
      details: 'success',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      action: 'ROLE CHANGE',
      targetType: 'Team',
      targetId: 'Sarah K. (Editor -> Manager)',
      details: 'success',
      ipAddress: '10.0.0.15',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      action: 'DELETE POST',
      targetType: 'Content',
      targetId: 'Draft post #12',
      details: 'success',
      ipAddress: '192.168.1.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      action: 'STOP STREAM',
      targetType: 'Stream',
      targetId: 'Tech Review Q2',
      details: 'success',
      ipAddress: '192.168.1.88',
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    }
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({
      data: {
        ...log,
        brandId: brand.id,
        userId: user.id
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
