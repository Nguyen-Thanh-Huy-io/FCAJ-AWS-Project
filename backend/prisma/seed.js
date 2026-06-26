const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies to avoid foreign key violations
  await prisma.auditLog.deleteMany({});
  await prisma.customRolePermission.deleteMany({});
  await prisma.customRole.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.adAnalytics.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.adAccount.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.userSettings.deleteMany({});
  await prisma.userAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.product.deleteMany({});
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

  console.log('Seeding Products...');
  await prisma.product.create({ data: { id: 'youtube_analytics', name: 'YouTube Analytics', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'facebook_management', name: 'Facebook Management', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'tiktok_creative', name: 'TikTok Creative Suite', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'instagram_insights', name: 'Instagram Insights', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'ai_content_engine', name: 'AI Content Engine', category: 'AI Tools' } });
  await prisma.product.create({ data: { id: 'ai_best_time', name: 'AI Best Time Suggest', category: 'AI Tools' } });
  await prisma.product.create({ data: { id: 'ads_manager', name: 'Ads Manager Pro', category: 'Management' } });
  await prisma.product.create({ data: { id: 'unified_inbox', name: 'Unified Inbox', category: 'Management' } });
  await prisma.product.create({ data: { id: 'custom_links', name: 'Custom Branded Links', category: 'Tools' } });

  console.log('Seeding Plans...');
  const proPlan = await prisma.plan.create({
    data: {
      name: 'PRO',
      priceAmount: 29.00,
      currency: 'USD',
      billingCycle: 'MONTHLY',
      description: 'Professional Plan',
      planLimitId: proLimit.id,
      isActive: true,
      products: {
        connect: [
          { id: 'youtube_analytics' },
          { id: 'facebook_management' },
          { id: 'tiktok_creative' },
          { id: 'instagram_insights' },
          { id: 'ai_content_engine' },
          { id: 'ai_best_time' },
          { id: 'ads_manager' },
          { id: 'unified_inbox' },
          { id: 'custom_links' }
        ]
      }
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
      isActive: true,
      products: {
        connect: [
          { id: 'youtube_analytics' },
          { id: 'facebook_management' }
        ]
      }
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
  // Password is 'nhacc123@'
  const passwordHash = require('bcryptjs').hashSync('nhacc123@', 10);
  const user = await prisma.user.create({
    data: {
      email: 'vothanhnha26@gmail.com',
      passwordHash: passwordHash,
      name: 'Nhã Võ',
      role: 'ADMIN',
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

  console.log('Seeding SmartLinks...');
  const smartLink = await prisma.smartLink.create({
    data: {
      brandId: brand.id,
      slug: 'metricool-instagram-en',
      pageTitle: 'Metricool Instagram EN',
      bio: 'Social analytics, content planning, and link performance in one place.',
      profileImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      backgroundType: 'THEME',
      backgroundValue: 'midnight',
      buttonStyle: 'rounded',
      socialLinks: 'instagram=https://instagram.com/publicast;youtube=https://youtube.com/@publicast;twitter=https://x.com/publicast',
      isPublished: true,
      links: {
        create: [
          {
            title: 'Download the FREE 2026 Social Media Calendar',
            url: 'https://publicast.com/calendar',
            emoji: '📅',
            position: 0,
            isActive: true,
            iconUrl: '',
            linkStyle: 'style:bgColor=#E6B325;textColor=#FFFFFF;borderColor=#E6B325',
            clicks: 134
          },
          {
            title: 'Watch the webinar replay',
            url: 'https://publicast.com/webinar',
            emoji: '🎥',
            position: 1,
            isActive: true,
            iconUrl: '',
            linkStyle: 'style:bgColor=#4A90E2;textColor=#FFFFFF;borderColor=#4A90E2',
            clicks: 58
          },
          {
            title: 'Read the growth playbook',
            url: 'https://publicast.com/playbook',
            emoji: '📘',
            position: 2,
            isActive: true,
            iconUrl: '',
            linkStyle: 'style:bgColor=#E65C9C;textColor=#FFFFFF;borderColor=#E65C9C',
            clicks: 36
          }
        ]
      }
    },
    include: {
      links: true
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Seed 90 days of metrics
  const analyticsDays = Array.from({ length: 90 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (89 - index));
    
    // Wave patterns for realistic weekly cycle
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    const weekendFactor = isWeekend ? 0.45 : 1.0; // Drop in weekend traffic
    
    const sineWave = Math.sin((index / 89) * Math.PI * 6) * 0.4 + 0.6; // Multi-cycle wave
    const randomNoise = (Math.random() * 0.2) - 0.1; // Minor daily variations
    
    // Spikes representing campaign posts or newsletter blasts
    let spike = 0;
    if (index === 15) spike = 45; // Huge spike early on
    if (index === 42) spike = 35;
    if (index === 78) spike = 50; // Spike in the last 2 weeks
    if (index === 87) spike = 25;
    
    const visits = Math.max(8, Math.round((30 + sineWave * 50 + spike) * weekendFactor + (Math.random() * 6)));
    const buttonClicks = Math.max(3, Math.round(visits * (0.65 + randomNoise)));
    const uniqueVisitors = Math.max(2, Math.round(visits * (0.75 + randomNoise * 0.5)));
    
    return {
      date,
      visits,
      buttonClicks,
      uniqueVisitors
    };
  });

  await prisma.smartLinkDailyMetric.createMany({
    data: analyticsDays.map((day) => ({
      smartLinkId: smartLink.id,
      date: day.date,
      pageViews: day.visits,
      uniqueVisitors: day.uniqueVisitors
    }))
  });

  const linkOne = smartLink.links[0];
  const linkTwo = smartLink.links[1];
  const linkThree = smartLink.links[2];

  let totalClicksOne = 0;
  let totalClicksTwo = 0;
  let totalClicksThree = 0;

  const linkMetrics = analyticsDays.flatMap((day) => {
    const clicksOne = Math.max(1, Math.round(day.buttonClicks * 0.48));
    const clicksTwo = Math.max(0, Math.round(day.buttonClicks * 0.32));
    const clicksThree = Math.max(0, Math.round(day.buttonClicks * 0.20));

    totalClicksOne += clicksOne;
    totalClicksTwo += clicksTwo;
    totalClicksThree += clicksThree;

    return [
      {
        smartLinkId: smartLink.id,
        linkItemId: linkOne.id,
        date: day.date,
        clicks: clicksOne
      },
      {
        smartLinkId: smartLink.id,
        linkItemId: linkTwo.id,
        date: day.date,
        clicks: clicksTwo
      },
      {
        smartLinkId: smartLink.id,
        linkItemId: linkThree.id,
        date: day.date,
        clicks: clicksThree
      }
    ];
  });

  await prisma.linkItemDailyMetric.createMany({
    data: linkMetrics
  });

  // Update totalClicks on the SmartLink and individual LinkItems
  const sumTotalClicks = totalClicksOne + totalClicksTwo + totalClicksThree;
  await prisma.smartLink.update({
    where: { id: smartLink.id },
    data: { totalClicks: sumTotalClicks }
  });

  await prisma.linkItem.update({
    where: { id: linkOne.id },
    data: { clicks: totalClicksOne }
  });
  await prisma.linkItem.update({
    where: { id: linkTwo.id },
    data: { clicks: totalClicksTwo }
  });
  await prisma.linkItem.update({
    where: { id: linkThree.id },
    data: { clicks: totalClicksThree }
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

  console.log('Seeding PlatformLimits...');
  const platformLimits = [
    { platform: 'YOUTUBE', subType: 'VIDEO', maxCaptionLength: 5000, maxFileSizeMb: 1024, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: null, maxVideoDuration: null, aspectRatios: '16:9' },
    { platform: 'YOUTUBE', subType: 'SHORTS', maxCaptionLength: 100, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 1, maxVideoDuration: 60, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'POST', maxCaptionLength: 63206, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'FACEBOOK', subType: 'REEL', maxCaptionLength: 2000, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'TIKTOK', subType: 'VIDEO', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov,webm', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'POST', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 60, aspectRatios: '1:1,4:5' },
    { platform: 'INSTAGRAM', subType: 'REEL', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'LINKEDIN', subType: 'POST', maxCaptionLength: 3000, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: null },
    { platform: 'DISCORD', subType: 'POST', maxCaptionLength: 2000, maxFileSizeMb: 25, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'TELEGRAM', subType: 'POST', maxCaptionLength: 1024, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null }
  ];

  for (const limit of platformLimits) {
    await prisma.platformLimit.upsert({
      where: {
        platform_subType: {
          platform: limit.platform,
          subType: limit.subType
        }
      },
      update: limit,
      create: limit
    });
  }

  console.log('Seeding AdAccounts and AdAnalytics...');
  const fbAdAccount = await prisma.adAccount.create({
    data: {
      brandId: brand.id,
      platform: 'META_ADS',
      platformAccountId: 'act_10928374',
      accountName: 'Meta Ads - PubliCast Campaign',
      currency: 'USD',
      timezone: 'Asia/Ho_Chi_Minh',
      accessToken: 'eaab_mock_token_123',
      isActive: true,
      lastSyncAt: new Date()
    }
  });

  const ggAdAccount = await prisma.adAccount.create({
    data: {
      brandId: brand.id,
      platform: 'GOOGLE_ADS',
      platformAccountId: 'act_82736451',
      accountName: 'Google Search Ads - PubliCast App',
      currency: 'USD',
      timezone: 'Asia/Ho_Chi_Minh',
      accessToken: 'ya29_mock_token_456',
      isActive: true,
      lastSyncAt: new Date()
    }
  });

  // Generate daily metrics for both ad accounts for 30 days
  const adAnalyticsList = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    // FB Ads metrics
    const fbSpend = parseFloat((50 + Math.sin(i) * 20 + Math.random() * 10).toFixed(2));
    const fbImpressions = Math.floor(fbSpend * 80 + Math.random() * 200);
    const fbClicks = Math.floor(fbImpressions * 0.022 + Math.random() * 15);
    const fbConversions = Math.floor(fbClicks * 0.12 + Math.random() * 2);
    const fbConversionValue = fbConversions * 45; // 45$ per conversion value
    const fbRoas = fbSpend > 0 ? parseFloat((fbConversionValue / fbSpend).toFixed(2)) : 0;

    const fbAnalytics = await prisma.analytics.create({
      data: {
        brandId: brand.id,
        adAccountId: fbAdAccount.id,
        dateFrom: d,
        dateTo: d,
        granularity: 'DAY',
        fetchedAt: new Date(),
        analyticsType: 'AD',
        adAnalytics: {
          create: {
            campaignId: 'camp_fb_q2',
            campaignName: 'Summer Launch Campaign',
            adSetId: 'adset_fb_1',
            totalSpend: fbSpend,
            impressions: fbImpressions,
            clicks: fbClicks,
            ctr: fbImpressions > 0 ? parseFloat(((fbClicks / fbImpressions) * 100).toFixed(2)) : 0,
            cpc: fbClicks > 0 ? parseFloat((fbSpend / fbClicks).toFixed(2)) : 0,
            cpm: fbImpressions > 0 ? parseFloat(((fbSpend / fbImpressions) * 1000).toFixed(2)) : 0,
            conversions: fbConversions,
            conversionValue: fbConversionValue,
            cpa: fbConversions > 0 ? parseFloat((fbSpend / fbConversions).toFixed(2)) : 0,
            roas: fbRoas,
            reach: Math.floor(fbImpressions * 0.85),
            frequency: 1.0
          }
        }
      }
    });

    // Google Ads metrics
    const ggSpend = parseFloat((80 + Math.cos(i) * 30 + Math.random() * 15).toFixed(2));
    const ggImpressions = Math.floor(ggSpend * 60 + Math.random() * 150);
    const ggClicks = Math.floor(ggImpressions * 0.038 + Math.random() * 25);
    const ggConversions = Math.floor(ggClicks * 0.08 + Math.random() * 3);
    const ggConversionValue = ggConversions * 50;
    const ggRoas = ggSpend > 0 ? parseFloat((ggConversionValue / ggSpend).toFixed(2)) : 0;

    const ggAnalytics = await prisma.analytics.create({
      data: {
        brandId: brand.id,
        adAccountId: ggAdAccount.id,
        dateFrom: d,
        dateTo: d,
        granularity: 'DAY',
        fetchedAt: new Date(),
        analyticsType: 'AD',
        adAnalytics: {
          create: {
            campaignId: 'camp_gg_search',
            campaignName: 'SaaS App Search Leads',
            adSetId: 'adset_gg_2',
            totalSpend: ggSpend,
            impressions: ggImpressions,
            clicks: ggClicks,
            ctr: ggImpressions > 0 ? parseFloat(((ggClicks / ggImpressions) * 100).toFixed(2)) : 0,
            cpc: ggClicks > 0 ? parseFloat((ggSpend / ggClicks).toFixed(2)) : 0,
            cpm: ggImpressions > 0 ? parseFloat(((ggSpend / ggImpressions) * 1000).toFixed(2)) : 0,
            conversions: ggConversions,
            conversionValue: ggConversionValue,
            cpa: ggConversions > 0 ? parseFloat((ggSpend / ggConversions).toFixed(2)) : 0,
            roas: ggRoas,
            reach: Math.floor(ggImpressions * 0.9),
            frequency: 1.0
          }
        }
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
