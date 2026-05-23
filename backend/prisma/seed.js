const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies to avoid foreign key violations
  await prisma.auditLog.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.userSettings.deleteMany({});
  await prisma.userAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.planLimit.deleteMany({});

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
        create: {
          provider: 'LOCAL',
          passwordHash: passwordHash
        }
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
